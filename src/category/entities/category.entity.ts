import { ApiHideProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ApiHideProperty()
  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
