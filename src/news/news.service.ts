// src/news/news.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { SearchNewsDto } from './dto/search-news.dto';
import { SearchBySourceDto } from './dto/search-by-source.dto';
import { NewsArticle } from './interfaces/news.interface';
import { firstValueFrom } from 'rxjs';

interface NewsApiResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private readonly baseUrl = this.configService.get<string>('gnews.baseUrl');
  private readonly apiKey = this.configService.get<string>('gnews.apiKey');

  async searchNews(searchDto: SearchNewsDto): Promise<NewsArticle[]> {
    const cacheKey = `news_${JSON.stringify(searchDto)}`;

    // Check cache first
    const cachedData = await this.cacheManager.get<NewsArticle[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Build query parameters
    const params = new URLSearchParams({
      token: this.apiKey,
      q: searchDto.q,
      lang: searchDto.lang || 'en',
      country: searchDto.country || 'us',
      max: (searchDto.max || 10).toString()
    });

    // Add source if provided
    if (searchDto.source) {
      // GNews expects source parameter for filtering
      params.append('source', searchDto.source);
    }
    // Build the base URL with the required token
    let requestUrl = `${this.baseUrl}/search?token=${this.apiKey}`;

    // Add each parameter manually to ensure proper encoding
    if (searchDto.q) {
      const encodedQuery = `"${encodeURIComponent(searchDto.q).replace(/'/g, '%27')}"`;
      requestUrl += `&q=${encodeURIComponent(encodedQuery)}`;
    }

    if (searchDto.lang) {
      requestUrl += `&lang=${encodeURIComponent(searchDto.lang)}`;
    } else {
      requestUrl += '&lang=en';
    }

    if (searchDto.country) {
      requestUrl += `&country=${encodeURIComponent(searchDto.country)}`;
    } else {
      requestUrl += '&country=us';
    }

    if (searchDto.max) {
      requestUrl += `&max=${searchDto.max}`;
    } else {
      requestUrl += '&max=10';
    }

    if (searchDto.source) {
      requestUrl += `&domains=${encodeURIComponent(searchDto.source)}`;
    }

    try {

      console.log('Request URL:', requestUrl);

      const response = await firstValueFrom(
        this.httpService.get(requestUrl),
      );

      if (!response.data || !response.data.articles) {
        throw new HttpException(
          'Invalid response from news API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const articles = response.data.articles;

      // Cache the results
      await this.cacheManager.set(cacheKey, articles);

      const result: NewsApiResponse = {
        totalArticles: response.data.totalArticles,
        articles: articles,
      }
      return result.articles;

    } catch (error) {
      console.error('News API Error:', error.response?.data || error.message);

      // Improved error handling
      if (error.response?.data?.errors) {
        throw new HttpException(
          error.response.data.errors[0],
          error.response.status || HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        'Failed to fetch news articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // New method for searching by source
  async searchBySource(searchDto: SearchBySourceDto): Promise<any> {
    const cacheKey = `news_source_${JSON.stringify(searchDto)}`;

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const params = new URLSearchParams({
        token: this.apiKey,
        q: searchDto.q,
        lang: searchDto.lang || 'en',
        country: searchDto.country || 'us',
        max: (searchDto.max || 10).toString(),
        // Use the domains parameter instead of site: operator
        domains: searchDto.source
      });

      console.log('Request URL:', `${this.baseUrl}/search?${params.toString()}`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/search?${params.toString()}`),
      );

      if (!response.data || !response.data.articles) {
        throw new HttpException(
          'Invalid response from news API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const result = {
        totalArticles: response.data.totalArticles,
        articles: response.data.articles
      };

      await this.cacheManager.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('News API Error:', error.response?.data || error.message);

      if (error.response?.data?.errors) {
        throw new HttpException(
          error.response.data.errors,
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        'Failed to fetch news articles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArticleByTitle(title: string): Promise<NewsArticle | null> {
    if (!title) {
      throw new HttpException(
        'Title is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const cacheKey = `article_${title}`;

    // Check cache first
    const cachedArticle = await this.cacheManager.get<NewsArticle>(cacheKey);
    if (cachedArticle) {
      return cachedArticle;
    }

    const articles = await this.searchNews({ q: title });
    const article = articles[0] || null;

    if (article) {
      await this.cacheManager.set(cacheKey, article);
    }

    return article;
  }
}