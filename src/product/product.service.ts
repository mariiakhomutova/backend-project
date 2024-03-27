import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    dto: CreateProductDto,
    image: Express.Multer.File,
  ): Promise<ProductEntity> {
    const product = new ProductEntity();
    product.image = image.filename;
    product.name = dto.name;
    product.description = dto.description;
    product.sizes = dto.sizes;
    product.price = dto.price;
    product.brand = dto.brand;
    product.material = dto.material;
    product.sku = dto.sku;
    product.country = dto.country;
    product.colour = dto.colour;
    product.sex = dto.sex;

    const newProduct = await this.productRepository.save(product);

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
      relations: ['products'],
    });

    category.products.push(product);

    await this.categoryRepository.save(category);

    return newProduct;
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    return this.productRepository.findOneBy({ id });
  }

  async findByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.categoryId = :categoryId', { categoryId })
      .getMany();
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    image: Express.Multer.File,
  ): Promise<ProductEntity> {
    const toUpdate = await this.productRepository.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Записи с id=${id} не найдено`);
    }
    if (dto.name) toUpdate.name = dto.name;
    if (dto.description) toUpdate.description = dto.description;
    if (dto.sizes) toUpdate.sizes = dto.sizes;
    if (dto.price) toUpdate.price = dto.price;
    if (dto.brand) toUpdate.brand = dto.brand;
    if (dto.material) toUpdate.material = dto.material;
    if (dto.sku) toUpdate.sku = dto.sku;
    if (dto.country) toUpdate.country = dto.country;
    if (dto.colour) toUpdate.colour = dto.colour;
    if (dto.sex) toUpdate.sex = dto.sex;
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
        relations: ['products'],
      });
      toUpdate.category = category;
    }
    if (image) {
      if (toUpdate.image !== image.filename) {
        fs.unlink(`db_images/product/${toUpdate.image}`, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      toUpdate.image = image.filename;
    }

    return this.productRepository.save(toUpdate);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }
}
