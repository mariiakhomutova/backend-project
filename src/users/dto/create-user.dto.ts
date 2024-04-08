import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role } from '../role/role';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'name1' })
  username: string;

  @ApiProperty({ default: '1234' })
  password: string;

  @ApiHideProperty()
  @IsNotEmpty()
  role: Role = Role.USER;
}
