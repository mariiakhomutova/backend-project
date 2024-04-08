import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Fullname: string;

  @Column()
  deladdress: string;

  @Column()
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;
  @OneToOne(() => UserEntity, (user) => user.order)
  @JoinColumn()
  user: UserEntity;
  @OneToMany(() => OrderItemEntity, (orderItems) => orderItems.order)
  orderItems: OrderItemEntity[];
}
