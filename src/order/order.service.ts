import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { CartService } from 'src/cart/cart.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItemEntity)
    private orderitemRepository: Repository<OrderItemEntity>,
    private readonly cartService: CartService,
    private readonly userService: UsersService,
  ) {}
  async order(req: any, dto: CreateOrderDto) {
    const userCart = await this.cartService.getUserCart(req.user);
    if (userCart.CartItems.length == 0) {
      throw new BadRequestException(
        'Вы не можете оформить заказ с пустой корзиной',
      );
    }
    const order = await this.orderRepository.create({
      Fullname: dto.Fullname,
      deladdress: dto.deladdress,
      totalPrice: 0,
      user: req.user,
      orderItems: [],
    });

    for (let i = 0; i <= userCart.CartItems.length; i++) {
      if (userCart.CartItems[i] && userCart.CartItems[i].product) {
        const orderItem = this.orderitemRepository.create({
          product: userCart.CartItems[i].product,
        });
        orderItem.orderPrice = userCart.CartItems[i].cartPrice;
        await this.orderitemRepository.save(orderItem);
        order.orderItems.push(orderItem);
      }
    }
    if (order.orderItems == null) {
      return 0;
    }
    let sum = 0;
    order.orderItems.forEach((a) => (sum += a.orderPrice));
    order.totalPrice = sum;

    order.user = req.user;
    const orderNew = await this.orderRepository.save(order);
    await this.cartService.removeCart(req.user.id);
    return orderNew;
  }

  async getItemsFromCart(user: any) {
    const items = await this.cartService.findAll(user);
    return items;
  }
  async create(user: UserEntity, dto: CreateOrderDto) {
    const order = new Order();
    order.Fullname = dto.Fullname;
    order.deladdress = dto.deladdress;
    order.totalPrice = 0;
    order.user = user;
    await this.orderRepository.save(order);
    return order;
  }
  async getOrdersUser(req: any) {
    const userOrder = await this.orderRepository.find({
      relations: {
        orderItems: {
          product: true,
        },
      },
      where: {
        user: req.user,
      },
    });
    return userOrder;
  }
}
