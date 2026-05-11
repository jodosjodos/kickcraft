import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\+250[0-9]{9}$/, {
    message: 'phone must be a valid Rwanda number (+250XXXXXXXXX)',
  })
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
