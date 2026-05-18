import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDirectDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
