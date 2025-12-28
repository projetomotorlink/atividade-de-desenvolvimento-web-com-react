import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateServiceDto } from './create-service.dto';
import { StatusRole } from '../entities/work-order.entity';

// DTO para atualizar uma ordem de serviço
export class UpdateWorkOrderDto {
  @ApiProperty({
    example:
      'Veículo Fiat Uno - Atualização: também precisa trocar as pastilhas de freio',
    description: 'Nova descrição da ordem de serviço',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  description?: string;

  @ApiProperty({
    type: [CreateServiceDto],
    description: 'Nova lista completa de serviços (substitui a lista anterior)',
    example: [
      { name: 'Troca de óleo', currentPrice: 150.5 },
      { name: 'Alinhamento', currentPrice: 80.0 },
      { name: 'Troca de pastilhas', currentPrice: 200.0 },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Os serviços devem ser enviados em uma lista' })
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services?: CreateServiceDto[];

  @ApiProperty({
    enum: StatusRole,
    example: StatusRole.IN_PROGRESS,
    description: 'Novo status da ordem de serviço',
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusRole, { message: 'Status inválido' })
  status?: StatusRole;
}
