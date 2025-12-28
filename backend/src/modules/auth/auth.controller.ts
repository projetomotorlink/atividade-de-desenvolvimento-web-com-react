import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { ResponseRegistrationDto } from './dto/response-registration.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from './guards/access-token.guard';
import type { RequestWithUser } from './interfaces/request-with-user.interface';
import type { RequestWithAccessToken } from './interfaces/request-with-user.interface';
import type { AuthTokens } from './interfaces/auth-tokens.interface';

@ApiTags('Autenticação')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registra um novo usuário e sua oficina
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registra um novo usuário e sua oficina' })
  async registration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<ResponseRegistrationDto> {
    return await this.authService.registration(registrationDto);
  }

  // Realiza login e retorna tokens JWT
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login e retorna tokens JWT' })
  async login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {
    return this.authService.login(loginDto);
  }

  // Renova os tokens JWT usando refresh token
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refreshToken')
  @ApiOperation({ summary: 'Renova os tokens JWT usando refresh token' })
  async refresh(@Req() req: RequestWithUser): Promise<AuthTokens> {
    const refreshToken = req.user.refreshToken;
    return await this.authService.refreshTokens({ refreshToken });
  }

  // Realiza logout do usuário
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'Realiza logout do usuário' })
  async logout(
    @Req() req: RequestWithAccessToken,
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    return this.authService.logout(userId);
  }
}
