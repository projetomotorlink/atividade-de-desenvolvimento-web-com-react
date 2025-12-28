import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/entities/user.entity';

// DTO para representar os dados da oficina no response de registro
export class ShopResponseDto {
  @ApiProperty({
    description: 'ID único da oficina',
    example: '456e7890-e12b-34d5-b678-123456789abc',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da oficina',
    example: 'Oficina João Silva',
  })
  shopName: string;

  @ApiProperty({
    description: 'Data de criação da oficina',
    example: '2025-12-26T18:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização da oficina',
    example: '2025-12-26T18:00:00.000Z',
  })
  updatedAt: Date;
}

// DTO para a resposta de registro de usuário
export class ResponseRegistrationDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Primeiro nome do usuário',
    example: 'João',
  })
  firstName: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
  })
  lastName: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Dados da oficina associada ao usuário',
    type: ShopResponseDto,
  })
  shop: ShopResponseDto;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2025-12-26T18:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização do usuário',
    example: '2025-12-26T18:00:00.000Z',
  })
  updatedAt: Date;
}
