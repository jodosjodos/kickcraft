import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPasswordChangeDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
