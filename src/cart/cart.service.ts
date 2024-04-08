import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { ProductService } from 'src/product/product.service';
import { CartItemEntity } from './entities/cart-item.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    private readonly productService: ProductService,
  ) {}

  async create(user: UserEntity): Promise<Cart> {
    const cart = new Cart();
    cart.user = user;
    await this.cartRepository.save(cart);
    return cart;
  }

  async get(userId: number): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException(
        'Невозможно найти корзину с таким id: ' + userId,
      );
    }

    return cart.getTotalPrice();
  }

  async CreateCartItemDto(dto: CreateCartDto, user: any) {
    const product = await this.productService.findOne(dto.productId);

    if (!product) {
      throw new NotFoundException(
        'Не нашлось продукта с таким id: ' + dto.productId,
      );
    }

    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    if (userCart.CartItems.some((x) => x.product.id == product.id)) {
      const cItem = userCart.CartItems.find((x) => x.product.id == product.id);
      cItem.Count += +dto.count;
      return await this.cartItemRepository.save(cItem);
    }

    const cartItem = this.cartItemRepository.create({
      product: product,
      Count: +dto.count,
    });
    cartItem.cartPrice = product.price * dto.count;
    cartItem.cart = userCart;
    return await this.cartItemRepository.save(cartItem);
  }

  async findAll(user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });
    return userCart.CartItems;
  }

  async findOne(productId: number, user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    const product = userCart.CartItems.find((x) => x.id == productId);

    if (!product) {
      throw new NotFoundException('Этот товар не найлен по id: ' + productId);
    }

    return product;
  }

  async update(dto: UpdateCartDto, user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    const cartItem = await this.cartItemRepository.findOne({
      relations: {
        cart: true,
        product: true,
      },
      where: {
        product: await this.productService.findOne(dto.productId),
        cart: userCart,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        'Товар с таким id не найден: ' + dto.productId,
      );
    }

    cartItem.Count = dto.count;
    if (cartItem.Count == 0) {
      return await this.cartItemRepository.remove(cartItem);
    }
    return await this.cartItemRepository.save(cartItem);
  }

  async remove(productId: number, user: any): Promise<DeleteResult> {
    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    const cartItem = await this.cartItemRepository.findOne({
      relations: {
        cart: true,
        product: true,
      },
      where: {
        product: await this.productService.findOne(productId),
        cart: userCart,
      },
    });

    if (!CartItemEntity) {
      throw new NotFoundException('Не найден товар с таким id: ' + productId);
    }

    return await this.cartItemRepository.delete(cartItem);
  }

  async removeCart(user: any): Promise<DeleteResult> {
    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    if (!userCart) {
      throw new NotFoundException();
    }

    await this.cartItemRepository
      .createQueryBuilder()
      .delete()
      .where('cartId = :cartId', { cartId: userCart.id })
      .execute();

    userCart.CartItems = [];
    await this.cartRepository.save(userCart);

    return await this.cartRepository.delete(userCart.id);
  }
  async getUserCart(user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        CartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });
    return userCart;
  }
}
