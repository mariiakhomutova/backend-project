import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Fullname: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deladdress: string;
}
