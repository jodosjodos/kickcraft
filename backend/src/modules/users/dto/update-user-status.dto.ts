import { IsEnum } from 'class-validator';
import { UserStatus } from '../user.entity';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status!: UserStatus;
}
