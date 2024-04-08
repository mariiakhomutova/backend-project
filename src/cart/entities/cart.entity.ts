import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  CartItems: CartItemEntity[];

  getTotalPrice() {
    if (this.CartItems == null) {
      return 0;
    }
    let sum = 0;
    this.CartItems.forEach((a) => (sum += a.product.price * a.Count));
    return sum;
  }
}
