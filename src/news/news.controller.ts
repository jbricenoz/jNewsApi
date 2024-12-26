// src/news/news.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { NewsService } from './news.service';
import { SearchNewsDto } from './dto/search-news.dto';
import { SearchBySourceDto } from './dto/search-by-source.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search news articles' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns an array of news articles based on search criteria' 
  })
  async searchNews(@Body() searchDto: SearchNewsDto) {
    return this.newsService.searchNews(searchDto);
  }

  @Post('search/source')
  @ApiOperation({ summary: 'Search news articles by source' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns an array of news articles from specific source' 
  })
  async searchBySource(@Body() searchDto: SearchBySourceDto) {
    return this.newsService.searchBySource(searchDto);
  }


  @Post('article')
  @ApiOperation({ summary: 'Get article by title' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a single news article matching the title' 
  })
  async getArticleByTitle(@Body() { title }: { title: string }) {
    return this.newsService.getArticleByTitle(title);
  }
}