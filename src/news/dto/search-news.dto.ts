import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchNewsDto {

    @ApiProperty({
        example: 'technology',
        description: 'Search query',
        required: true
    })
    @IsString()
    q: string;

    @ApiProperty({
        example: 'en',
        description: 'Language of articles',
        required: false,
        default: 'en'
    })
    @IsString()
    @IsOptional()
    lang?: string;

    @ApiProperty({
        example: 'us',
        description: 'Country of articles',
        required: false,
        default: 'us'
    })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({
        example: 10,
        description: 'Maximum number of articles to return',
        minimum: 1,
        maximum: 100,
        default: 10,
        required: false
    })
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    max?: number;

    @ApiProperty({
        example: 'reuters.com',
        description: 'Source domain to filter articles',
        required: false
    })
    @IsString()
    @IsOptional()
    source?: string;
}