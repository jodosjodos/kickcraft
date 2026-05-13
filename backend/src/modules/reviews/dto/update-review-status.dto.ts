import { IsEnum } from 'class-validator';
import { ReviewStatus } from '../review.entity';

export class UpdateReviewStatusDto {
  @IsEnum(ReviewStatus)
  status!: ReviewStatus;
}
