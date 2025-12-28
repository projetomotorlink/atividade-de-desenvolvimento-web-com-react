import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGIES } from '../constants/jwt.constants';

// Guard de autenticação para tokens de atualização
@Injectable()
export class RefreshTokenGuard extends AuthGuard(JWT_STRATEGIES.REFRESH) {}
