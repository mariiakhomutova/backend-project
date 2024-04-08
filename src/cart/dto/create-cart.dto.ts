import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  count: number;
}
