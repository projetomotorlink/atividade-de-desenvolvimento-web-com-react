import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

// Chave usada para armazenar os papéis no metadata
export const ROLES_KEY = 'roles';

// Decorador para definir os papéis necessários para acessar um recurso
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
