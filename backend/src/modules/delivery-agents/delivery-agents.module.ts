import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryAgent } from './delivery-agent.entity';
import { DeliveryAgentsService } from './delivery-agents.service';
import { DeliveryAgentsController } from './delivery-agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryAgent])],
  providers: [DeliveryAgentsService],
  controllers: [DeliveryAgentsController],
})
export class DeliveryAgentsModule {}
