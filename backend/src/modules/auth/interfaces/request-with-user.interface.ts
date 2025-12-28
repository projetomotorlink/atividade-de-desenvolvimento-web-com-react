import { Request } from 'express';
import { UserRole } from '../../user/entities/user.entity';

// Define o formato dos dados que estarão presentes na requisição quando o usuário estiver autenticado
export interface RequestWithUser extends Request {
  user: {
    sub: string;
    refreshToken: string;
  };
}

// Define o formato dos dados que estarão presentes na requisição quando o token de acesso for utilizado
export interface RequestWithAccessToken extends Request {
  user: {
    sub: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    shopId: string | null;
    shopName: string | null;
  };
}
