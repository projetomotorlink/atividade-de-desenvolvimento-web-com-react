import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';
import { RequestWithAccessToken } from '../interfaces/request-with-user.interface';

// Guard para proteger rotas com base nos papéis dos usuários
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Método para verificar se o usuário tem o papel necessário para acessar a rota
  canActivate(context: ExecutionContext): boolean {
    // Obtém os papéis necessários definidos no decorador da rota
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não houver papéis necessários, permite o acesso
    if (!requiredRoles) {
      return true;
    }

    // Obtém o papel do usuário a partir do request
    const request = context.switchToHttp().getRequest<RequestWithAccessToken>();

    // Verifica o papel do usuário
    const userRole = request.user?.role;

    // Se o usuário não tiver um papel, nega o acesso
    if (!userRole) {
      return false;
    }

    // Verifica se o papel do usuário está entre os papéis necessários
    return requiredRoles.some((role) => role === userRole);
  }
}
