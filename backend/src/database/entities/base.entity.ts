import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

// Entidade base para todas as entidades do banco de dados
// Inclui colunas comuns como createdAt, updatedAt e deletedAt
// A deletedAt é opcional e usada para soft delete
export abstract class BaseEntity {
  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Data e hora de criação do registro',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T12:00:00Z',
    description: 'Data e hora da última atualização do registro',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    example: '2024-01-03T12:00:00Z',
    description: 'Data e hora da exclusão do registro',
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
