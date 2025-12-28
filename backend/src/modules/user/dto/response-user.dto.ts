import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

// DTO para resposta de usuário
export class ResponseUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Carlos' })
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  lastName: string;

  @ApiProperty({ example: 'carlos@oficina.com.br' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({ example: '2025-12-27T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-27T10:00:00Z' })
  updatedAt: Date;
}
