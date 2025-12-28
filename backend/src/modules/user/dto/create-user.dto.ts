import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { Trim } from '../../../common/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

// DTO para criação de usuário
export class CreateUserDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  lastName: string;

  @ApiProperty({ example: 'carlos@oficina.com.br' })
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  email: string;

  @ApiProperty({ example: 'uuid-do-centro-de-servicos' })
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({ example: UserRole.CUSTOMER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

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
