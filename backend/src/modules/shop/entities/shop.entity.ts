import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity as Timestamps } from '../../../database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { WorkOrders } from '../../work-order/entities/work-order.entity';

@Entity('shops')
export class Shop extends Timestamps {
  @ApiProperty({
    example: 'b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6',
    description: 'Identificador único do centro de serviço',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: () => [WorkOrders],
    description: 'Lista de ordens de serviço associadas ao centro de serviço',
  })
  @OneToMany(() => WorkOrders, (ordem) => ordem.shop)
  ordens: WorkOrders[];

  @ApiProperty({
    example: 'Oficina Mecânica do Jão',
    description: 'Nome do centro de serviço',
  })
  @Column()
  shopName: string;
}
