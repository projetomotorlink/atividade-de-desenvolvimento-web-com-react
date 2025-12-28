import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity as Timestamps } from '../../../database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Service } from './service.entity';
import { Shop } from '../../shop/entities/shop.entity';
import { User } from '../../user/entities/user.entity';

export enum StatusRole {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('work_orders')
export class WorkOrders extends Timestamps {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Identificador único da ordem de serviço',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'PROT-2024-0001',
    description: 'Protocolo único da ordem de serviço',
  })
  @Column()
  protocolo: string;

  @ApiProperty({
    example: 'Veicular com problema no motor',
    description: 'Descrição detalhada da ordem de serviço',
  })
  @Column()
  description: string;

  @ApiProperty({
    type: () => [Service],
    description: 'Lista de serviços associados à ordem de serviço',
  })
  @OneToMany(() => Service, (service) => service.workOrder, { cascade: true })
  services: Service[];

  @ApiProperty({
    type: () => Shop,
    description: 'Loja associada à ordem de serviço',
  })
  @ManyToOne(() => Shop, (shop) => shop.ordens, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ApiProperty({
    type: () => User,
    description: 'Usuário que criou a ordem de serviço',
  })
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ApiProperty({
    enum: StatusRole,
    example: StatusRole.OPEN,
    description: 'Status atual da ordem de serviço',
  })
  @Column({ type: 'enum', enum: StatusRole, default: StatusRole.OPEN })
  status: StatusRole;

  @ApiProperty({
    example: 1500.75,
    description: 'Preço total da ordem de serviço',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  WorkOrderTotalPrice: number;
}
