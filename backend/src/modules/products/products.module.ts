import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { StorageModule } from '../storage/storage.module';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), StorageModule],
  providers: [ProductsService, RolesGuard],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
