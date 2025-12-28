import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { Shop } from '../shop/entities/shop.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import {
  JwtPayload,
  JwtRefreshPayload,
} from './interfaces/jwt-payload.interface';
import { JWT_CONFIG_KEYS, JWT_DEFAULTS } from './constants/jwt.constants';
import { ResponseRegistrationDto } from './dto/response-registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Registra um novo usuário e cria um novo centro de serviço (shop)
  async registration(
    registrationDto: RegistrationDto,
  ): Promise<ResponseRegistrationDto> {
    // Cria um queryRunner para gerenciar a transação
    const queryRunner = this.dataSource.createQueryRunner();

    // Conecta o queryRunner e inicia a transação
    await queryRunner.connect();

    // Inicia a transação
    await queryRunner.startTransaction();

    try {
      // Extrai os dados do DTO de registro
      const { password1, password2, email, shopName, ...userData } =
        registrationDto;

      // Valida se as senhas coincidem
      if (password1 !== password2) {
        throw new BadRequestException('As senhas não coincidem.');
      }

      // Verifica se o e-mail já está em uso
      const existingUser = await this.userService.findByEmail(
        email.toLowerCase(),
      );

      // Se o usuário já existir, lança uma exceção de conflito
      if (existingUser) {
        throw new ConflictException('Este e-mail já está em uso.');
      }

      // Cria o novo centro de serviço (shop)
      const shop = queryRunner.manager.create(Shop, { shopName });
      const savedShop = await queryRunner.manager.save(shop);

      // Cria o hash da senha
      const salt = await bcrypt.genSalt(JWT_DEFAULTS.BCRYPT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password1, salt);

      // Cria o novo usuário com o papel de ADMIN associado ao centro de serviço criado
      const newUser = queryRunner.manager.create(User, {
        ...userData,
        role: UserRole.ADMIN,
        email: email.toLowerCase(),
        password: hashedPassword,
        shop: savedShop,
      });

      // Salva o novo usuário no banco de dados
      const savedUser = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();

      // Retorna os dados do usuário criado (sem a senha)
      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        shop: savedShop,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };
    } catch (error) {
      // Em caso de erro, desfaz a transação
      await queryRunner.rollbackTransaction();

      // Lança a exceção de acordo com o tipo de erro
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar usuário e oficina');
    } finally {
      // Libera o queryRunner
      await queryRunner.release();
    }
  }

  // Faz o login do usuário
  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    // Extrai email e senha do DTO de login
    const { email, password } = loginDto;

    // Busca o usuário pelo email
    const user = await this.userService.findByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Gera os tokens JWT
    const payload = this.buildJwtPayload(user);

    // Cria access e refresh tokens
    const accessToken = this.createAccessToken(payload);

    // Cria o refresh token
    const refreshToken = this.createRefreshToken(user.id);

    // Salva o hash do refresh token no banco de dados
    await this.hashAndSaveRefreshToken(user.id, refreshToken);

    // Retorna os tokens e os dados do usuário (sem a senha)
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        shop: user.shop
          ? { id: user.shop.id, shopName: user.shop.shopName }
          : null,
      },
    };
  }

  // Cria o access token
  private createAccessToken(payload: JwtPayload): string {
    // Esse código (@ts-expect-error) é uma diretiva para o TypeScript ignorar o erro de tipo do sign()
    // @ts-expect-error - Incompatibilidade de tipos entre JwtService e nosso payload customizado
    return this.jwtService.sign(payload as Record<string, any>, {
      secret: this.getAccessTokenSecret(),
      expiresIn: this.getAccessTokenExpiration(),
    });
  }

  // Obtém o segredo do token de acesso
  private getAccessTokenSecret(): string {
    return this.configService.getOrThrow<string>(JWT_CONFIG_KEYS.ACCESS_SECRET);
  }

  // Cria o refresh token
  private createRefreshToken(userId: string): string {
    const refreshPayload: JwtRefreshPayload = { sub: userId };

    // Esse código (@ts-expect-error) é uma diretiva para o TypeScript ignorar o erro de tipo do sign()
    // @ts-expect-error - Incompatibilidade de tipos entre JwtService e nosso payload customizado
    return this.jwtService.sign(refreshPayload as Record<string, any>, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: this.getRefreshTokenExpiration(),
    });
  }

  // Constrói o payload JWT com as informações do usuário
  private buildJwtPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      shopId: user.shop?.id || null,
      shopName: user.shop?.shopName || null,
    };
  }

  // Obtém o segredo do refresh token
  private getRefreshTokenSecret(): string {
    const secret = this.configService.get<string>(
      JWT_CONFIG_KEYS.REFRESH_SECRET,
    );
    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_REFRESH_SECRET não configurado nas variáveis de ambiente.',
      );
    }
    return secret;
  }

  // Obtém o tempo de expiração do refresh token
  private getRefreshTokenExpiration(): string {
    return (
      this.configService.get<string>(JWT_CONFIG_KEYS.REFRESH_EXPIRATION) ||
      JWT_DEFAULTS.REFRESH_EXPIRATION
    );
  }

  // Obtém o tempo de expiração do access token
  private getAccessTokenExpiration(): string {
    return (
      this.configService.get<string>(JWT_CONFIG_KEYS.ACCESS_EXPIRATION) ||
      JWT_DEFAULTS.ACCESS_EXPIRATION
    );
  }

  // Hash e salva o refresh token no banco de dados
  private async hashAndSaveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      JWT_DEFAULTS.BCRYPT_ROUNDS,
    );
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  //  Atualiza os tokens usando o refresh token
  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    // Extrai o refresh token do DTO
    const { refreshToken } = refreshTokenDto;

    try {
      // Verifica e decodifica o refresh token
      const payload = this.jwtService.verify<JwtRefreshPayload>(refreshToken, {
        secret: this.getRefreshTokenSecret(),
      });

      // Busca o usuário pelo ID no payload
      const user = await this.userService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token inválido.');
      }

      // Compara o refresh token fornecido com o hash armazenado
      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token inválido.');
      }

      // Gera novos tokens
      const newPayload = this.buildJwtPayload(user);

      // Cria novos access e refresh tokens
      const newAccessToken = this.createAccessToken(newPayload);

      // Cria o novo refresh token
      const newRefreshToken = this.createRefreshToken(user.id);

      // Salva o hash do novo refresh token no banco de dados
      await this.hashAndSaveRefreshToken(user.id, newRefreshToken);

      // Retorna os novos tokens
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }

  // Faz o logout do usuário
  async logout(userId: string): Promise<{ message: string }> {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Logout realizado com sucesso.' };
  }
}
