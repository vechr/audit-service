import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum ESortMode {
  ASC = 'asc',
  DESC = 'desc',
}

export class OperatorQuery {
  @Expose()
  @IsOptional()
  equals: any;

  @Expose()
  @IsOptional()
  in: any;

  @Expose()
  @IsOptional()
  notIn: any;

  @Expose()
  @IsOptional()
  lt: any;

  @Expose()
  @IsOptional()
  lte: any;

  @Expose()
  @IsOptional()
  gt: any;

  @Expose()
  @IsOptional()
  gte: any;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Contains',
    example: 'something about name',
    type: String,
  })
  contains: any;

  @Expose()
  @IsOptional()
  startsWith: any;

  @Expose()
  @IsOptional()
  endsWith: any;
}

export interface IListRequestQuery<E = any, F = any> {
  filters: {
    pagination: {
      page: number;
      limit: number;
    };
    sort: {
      by: keyof E;
      mode: ESortMode;
    };
    field?: F;
  };
}

export class PaginationQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page', example: 1 })
  page = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Limit', example: 25 })
  limit = 25;
}

export class SortQuery<E> {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Sort By',
    example: 'createdAt',
    type: String,
  })
  by: keyof E | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsEnum(ESortMode)
  @ApiPropertyOptional({ description: 'Sort', example: 'asc', enum: ESortMode })
  mode: ESortMode;
}

export class BaseQueryValidator<E> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => PaginationQuery)
  @ApiPropertyOptional({ type: PaginationQuery })
  pagination: PaginationQuery;

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => SortQuery)
  @ApiPropertyOptional({ type: SortQuery<E> })
  sort: SortQuery<E>;
}
