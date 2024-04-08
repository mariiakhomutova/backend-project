import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Cart } from './cart.entity';

@Entity()
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Count: number;

  @Column()
  cartPrice: number;

  @ManyToOne(() => ProductEntity, (product) => product.cart)
  @JoinColumn()
  product: ProductEntity;

  @ManyToOne(() => Cart, (cart) => cart.CartItems)
  cart: Cart;
}
