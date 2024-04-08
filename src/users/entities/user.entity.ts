import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  OneToOne,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToOne(() => Order, (order) => order.user)
  order: Order;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
