import { IsEnum } from 'class-validator';
import { PaymentPhase } from '../order.entity';

export class UpdatePaymentPhaseDto {
  @IsEnum(PaymentPhase)
  paymentPhase!: PaymentPhase;
}
