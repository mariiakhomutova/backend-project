import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoryEntity } from 'src/category/entities/category.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  sizes: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  sku: number;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  colour: string;

  @Column({ nullable: true })
  sex: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  })
  @JoinColumn()
  category: CategoryEntity;
}
