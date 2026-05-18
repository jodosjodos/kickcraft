import { IsString, MaxLength } from 'class-validator';

export class UpdateUserNotesDto {
  @IsString()
  @MaxLength(2000)
  notes!: string;
}
