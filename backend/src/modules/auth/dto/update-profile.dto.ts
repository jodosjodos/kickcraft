import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+250[0-9]{9}$/, {
    message: 'phone must be a valid Rwanda number (+250XXXXXXXXX)',
  })
  phone?: string;
}
