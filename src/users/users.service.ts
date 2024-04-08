import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    private readonly cartService: CartService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findByUsername(dto.username);

    if (existingUser) {
      throw new BadRequestException(
        `Пользователь ${dto.username} уже существует`,
      );
    }

    const user = await this.repository.save(dto);
    const cart = await this.cartService.create(user);
    user.cart = cart;

    await this.repository.save(user);

    return user;

    return this.repository.save(dto);
  }

  async findByUsername(username: string) {
    return this.repository.findOneBy({ username });
  }

  async findById(id: number) {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async update(id: number, dto: UpdateUserDto) {
    const toUpdate = await this.repository.findOneBy({ id });
    if (!toUpdate) {
      throw new BadRequestException(`Записи с id=${id} не найдено`);
    }
    if (dto.username) {
      toUpdate.username = dto.username;
    }
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      toUpdate.password = await bcrypt.hash(dto.password, salt);
    }
    if (dto.role) throw new BadRequestException(`Роль нельзя менять`);

    return this.repository.save(toUpdate);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
