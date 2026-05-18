import { IsOptional, IsInt, Min, IsString, IsDateString } from 'class-validator';

export class UpdateSkuDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  threshold?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsDateString()
  lastRestocked?: string;
}
