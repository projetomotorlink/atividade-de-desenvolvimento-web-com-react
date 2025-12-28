import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGIES } from '../constants/jwt.constants';

// Guard de autenticação para tokens de acesso
@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGIES.ACCESS) {}
