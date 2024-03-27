import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ default: 'name1' })
  username: string;

  @ApiProperty({ default: '1234' })
  password: string;
}
