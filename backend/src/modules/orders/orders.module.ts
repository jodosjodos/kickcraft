import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { DeliveryAgent } from '../delivery-agents/delivery-agent.entity';
import { Sku } from '../inventory/sku.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, DeliveryAgent, Sku]),
    DiscountsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
