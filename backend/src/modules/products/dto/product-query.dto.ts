import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  ProductCategory,
  ProductStatus,
  ProductSubCategory,
} from '../product.entity';

type StatusFilter = ProductStatus | 'all';

export class ProductQueryDto {
  @IsOptional()
  @Transform(
    ({ value }: { value: unknown }) =>
      (Array.isArray(value) ? value : [value]) as unknown[],
  )
  @IsEnum(ProductCategory, { each: true })
  category?: ProductCategory[];

  @IsOptional()
  @Transform(
    ({ value }: { value: unknown }) =>
      (Array.isArray(value) ? value : [value]) as unknown[],
  )
  @IsEnum(ProductSubCategory, { each: true })
  subCategory?: ProductSubCategory[];

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsIn(['newest', 'price-asc', 'price-desc', 'popular'])
  sort?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsIn([...Object.values(ProductStatus), 'all'])
  status?: StatusFilter;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
