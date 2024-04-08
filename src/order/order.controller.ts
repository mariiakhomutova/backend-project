import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { OrderService } from 'src/order/order.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
@ApiTags('order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('post')
  async getItemsFromBasket(@Body() dto: CreateOrderDto, @Request() req: any) {
    return await this.orderService.order(req, dto);
  }
  @Get('getOrders')
  async getItemsFromOrder(@Request() req: any) {
    return await this.orderService.getOrdersUser(req);
  }
}
