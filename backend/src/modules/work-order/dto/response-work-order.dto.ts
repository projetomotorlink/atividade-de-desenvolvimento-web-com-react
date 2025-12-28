import { ApiProperty } from '@nestjs/swagger';
import { StatusRole } from '../entities/work-order.entity';

// DTO de resposta simplificado para informações do serviço
export class ResponseServiceDto {
  @ApiProperty({
    example: 1,
    description: 'ID único do serviço',
  })
  id: number;

  @ApiProperty({
    example: 'Troca de óleo do motor',
    description: 'Nome do serviço',
  })
  name: string;

  @ApiProperty({
    example: 150.5,
    description: 'Preço do serviço',
  })
  currentPrice: number;

  @ApiProperty({
    example: '2024-12-26T10:00:00.000Z',
    description: 'Data de criação do serviço',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-12-26T10:00:00.000Z',
    description: 'Data da última atualização do serviço',
  })
  updatedAt: Date;
}

/**
 * DTO de resposta simplificado para informações do usuário
 */
export class ResponseUserSimpleDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'ID do usuário',
  })
  id: string;

  @ApiProperty({
    example: 'Carlos',
    description: 'Primeiro nome',
  })
  firstName: string;

  @ApiProperty({
    example: 'Silva',
    description: 'Sobrenome',
  })
  lastName: string;

  @ApiProperty({
    example: 'carlos.silva@example.com',
    description: 'Email',
  })
  email: string;
}

/**
 * DTO de resposta simplificado para informações da loja
 */
export class ResponseShopSimpleDto {
  @ApiProperty({
    example: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6',
    description: 'ID da loja',
  })
  id: string;

  @ApiProperty({
    example: 'Oficina Mecânica do Carlão',
    description: 'Nome da loja',
  })
  shopName: string;
}

/**
 * DTO de resposta completo para uma ordem de serviço
 *
 * Retorna todos os dados da work order incluindo:
 * - Serviços associados
 * - Informações do criador
 * - Informações da loja
 */
export class ResponseWorkOrderDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'ID único da ordem de serviço',
  })
  id: string;

  @ApiProperty({
    example: 'PROT-2024-0001',
    description: 'Protocolo único da ordem de serviço',
  })
  protocolo: string;

  @ApiProperty({
    example: 'Veículo com problema no motor',
    description: 'Descrição detalhada',
  })
  description: string;

  @ApiProperty({
    type: [ResponseServiceDto],
    description: 'Lista de serviços',
  })
  services: ResponseServiceDto[];

  @ApiProperty({
    type: ResponseShopSimpleDto,
    description: 'Loja associada',
  })
  shop: ResponseShopSimpleDto;

  @ApiProperty({
    type: ResponseUserSimpleDto,
    description: 'Usuário que criou a ordem',
  })
  createdBy: ResponseUserSimpleDto;

  @ApiProperty({
    enum: StatusRole,
    example: StatusRole.OPEN,
    description: 'Status atual',
  })
  status: StatusRole;

  @ApiProperty({
    example: 1500.75,
    description: 'Preço total (soma de todos os serviços)',
  })
  WorkOrderTotalPrice: number;

  @ApiProperty({
    example: '2024-12-26T10:00:00.000Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-12-26T10:00:00.000Z',
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}
