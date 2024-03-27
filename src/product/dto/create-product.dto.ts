/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  image: Express.Multer.File;

  @IsString()
  name: string = 'Название товара';

  @IsString()
  description: string = 'Описание';

  @IsString()
  sizes: string = 'XS,S,M,L,XL';

  @IsNumberString()
  price: number;

  @IsString()
  brand: string = 'Бренд';

  @IsString()
  material: string = 'Состав';

  @IsNumberString()
  sku: number;

  @IsString()
  country: string = 'Производитель';

  @IsString()
  colour: string = 'Цвет';

  @IsString()
  sex: string = 'Пол';

  @IsNumberString()
  categoryId: number;
}
