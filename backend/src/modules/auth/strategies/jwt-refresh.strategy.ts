import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JWT_CONFIG_KEYS, JWT_STRATEGIES } from '../constants/jwt.constants';

// Estratégia para validar tokens de refresh
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.REFRESH,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>(
        JWT_CONFIG_KEYS.REFRESH_SECRET,
      ),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; iat?: number; exp?: number }) {
    // Extrai o token de refresh do header Authorization
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    return {
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
      refreshToken,
    };
  }
}
