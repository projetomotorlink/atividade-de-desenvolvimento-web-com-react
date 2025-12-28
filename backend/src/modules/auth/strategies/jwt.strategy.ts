import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_CONFIG_KEYS, JWT_STRATEGIES } from '../constants/jwt.constants';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

// Estratégia para validar tokens de acesso
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES.ACCESS,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>(
        JWT_CONFIG_KEYS.ACCESS_SECRET,
      ),
    });
  }

  validate(payload: JwtPayload) {
    return {
      sub: payload.sub,
      userId: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      shopId: payload.shopId,
      shopName: payload.shopName,
    };
  }
}
