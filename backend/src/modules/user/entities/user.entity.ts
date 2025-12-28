import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity as Timestamps } from '../../../database/entities/base.entity';
import { Shop } from '../../shop/entities/shop.entity';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ApiHideProperty } from '@nestjs/swagger/dist/decorators/api-hide-property.decorator';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User extends Timestamps {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Identificador único do usuário',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Carlos',
    description: 'Primeiro nome do usuário',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Silva',
    description: 'Sobrenome do usuário',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'carlos.silva@example.com',
    description: 'Endereço de e-mail do usuário',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ type: () => Shop })
  @OneToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CUSTOMER,
    description: 'Nível de acesso do usuário',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  /**
   * @ignore
   */
  @ApiHideProperty()
  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
    nullable: false,
  })
  password: string;

  @Column({ type: 'text', nullable: true, select: false })
  @Exclude()
  refreshToken: string | null;
}
