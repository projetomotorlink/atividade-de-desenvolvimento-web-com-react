import { ApiProperty } from '@nestjs/swagger';

// DTO para representar as informações básicas do usuário
class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'carlos@oficina.com.br',
  })
  email: string;

  @ApiProperty({
    description: 'Primeiro nome do usuário',
    example: 'Carlos',
  })
  firstName: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
  })
  lastName: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'Informações da loja associada ao usuário',
    nullable: true,
    example: { id: 'shop-uuid', shopName: 'Oficina do Carlos' },
  })
  shop: {
    id: string;
    shopName: string;
  } | null;
}

// DTO para a resposta de login
export class ResponseLoginDto {
  @ApiProperty({
    description: 'Token de acesso (curta duração - 15 minutos)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de atualização (longa duração - 7 dias)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Informações básicas do usuário autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
