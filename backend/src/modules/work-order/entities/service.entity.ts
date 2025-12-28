import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity as Timestamps } from '../../../database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { WorkOrders } from './work-order.entity';

@Entity('services')
export class Service extends Timestamps {
  @ApiProperty({
    example: 1,
    description: 'Identificador único do serviço',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Troca de óleo',
    description: 'Nome do serviço',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: () => WorkOrders,
    description: 'Ordem de serviço associada ao serviço',
  })
  @ManyToOne(() => WorkOrders, (workOrder) => workOrder.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrders;

  @ApiProperty({
    example: 199.99,
    description: 'Preço atual do serviço',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  currentPrice: number;
}
