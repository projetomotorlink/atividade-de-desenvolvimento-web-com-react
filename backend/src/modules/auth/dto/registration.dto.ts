import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/index';

// DTO para o registro de um novo usuário
export class RegistrationDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @Trim()
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @Trim()
  lastName: string;

  @ApiProperty({ example: 'Oficina do Carlos' })
  @IsString()
  @Trim()
  shopName: string;

  @ApiProperty({ example: 'carlos@oficina.com.br' })
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  password1: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  password2: string;
}
