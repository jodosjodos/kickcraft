import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ApplyDiscountDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsInt()
  @Min(0)
  orderTotal!: number;
}
