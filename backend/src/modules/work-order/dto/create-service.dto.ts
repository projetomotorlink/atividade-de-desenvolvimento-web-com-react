import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

// DTO para criação de um serviço
export class CreateServiceDto {
  @ApiProperty({
    example: 'Troca de óleo do motor',
    description: 'Nome/descrição do serviço a ser realizado',
  })
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório' })
  @IsString({ message: 'O nome do serviço deve ser um texto' })
  name: string;

  @ApiProperty({
    example: 150.5,
    description: 'Preço atual do serviço em reais',
    minimum: 0,
  })
  @IsNotEmpty({ message: 'O preço do serviço é obrigatório' })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  currentPrice: number;
}
