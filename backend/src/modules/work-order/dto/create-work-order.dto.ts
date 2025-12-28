import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateServiceDto } from './create-service.dto';
import { StatusRole } from '../entities/work-order.entity';

// DTO para criação de uma ordem de serviço
export class CreateWorkOrderDto {
  @ApiProperty({
    example: 'Veículo Fiat Uno apresentando problemas no motor e nos freios',
    description: 'Descrição detalhada do problema ou serviço solicitado',
  })
  @IsNotEmpty({ message: 'A descrição da ordem de serviço é obrigatória' })
  @IsString({ message: 'A descrição deve ser um texto' })
  description: string;

  @ApiProperty({
    type: [CreateServiceDto],
    description: 'Lista de serviços que compõem esta ordem de serviço',
    example: [
      { name: 'Troca de óleo', currentPrice: 150.5 },
      { name: 'Alinhamento', currentPrice: 80.0 },
    ],
  })
  @IsNotEmpty({ message: 'É necessário incluir ao menos um serviço' })
  @IsArray({ message: 'Os serviços devem ser enviados em uma lista' })
  @ArrayMinSize(1, { message: 'É necessário incluir ao menos um serviço' })
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services: CreateServiceDto[];

  @ApiProperty({
    enum: StatusRole,
    example: StatusRole.OPEN,
    description: 'Status inicial da ordem de serviço (opcional, padrão: OPEN)',
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusRole, { message: 'Status inválido' })
  status?: StatusRole;
}
