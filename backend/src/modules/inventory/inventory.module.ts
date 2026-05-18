import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sku } from './sku.entity';
import { Product } from '../products/product.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Sku, Product])],
  providers: [InventoryService, RolesGuard],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
