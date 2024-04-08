import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderItemEntity } from './entities/order-item.entity';
import { UsersModule } from 'src/users/users.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItemEntity]),
    UsersModule,
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
