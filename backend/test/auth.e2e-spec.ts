/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/modules/auth/auth.service';

// Teste de ponta a ponta (e2e) para o AuthController
describe('Auth (e2e)', () => {
  let app: INestApplication;

  // Mock do AuthService para isolar os testes
  const mockAuthService = {
    registration: jest.fn(),
    login: jest.fn(),
  };

  // Configuração antes de cada teste
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    // Inicialização da aplicação NestJS para testes
    app = moduleFixture.createNestApplication();

    // Configuração dos pipes globais e versionamento da API
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    // Configuração do versionamento da API
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // Inicializa a aplicação
    await app.init();
  });

  // Fechamento da aplicação após todos os testes
  afterAll(async () => {
    await app.close();
  });

  // Testes para o endpoint de registro
  describe('/v1/auth/registration (POST)', () => {
    it('deve retornar 201 ao registrar com sucesso', () => {
      const registrationDto = {
        email: 'novo@usuario.com',
        password1: 'Senha123!',
        password2: 'Senha123!',
        firstName: 'João',
        lastName: 'Silva',
        shopName: 'Minha Oficina',
      };

      // Mock da resposta do serviço de autenticação
      mockAuthService.registration.mockResolvedValue({
        user: { email: 'novo@usuario.com' },
      });

      // Chamada ao endpoint de registro e verificação da resposta
      return request(app.getHttpServer() as App)
        .post('/v1/auth/registration')
        .send(registrationDto)
        .expect(201)
        .expect((res) => {
          const body = res.body as Record<string, any>;
          expect(body.user.email).toBe('novo@usuario.com');
        });
    });

    // Teste para dados inválidos
    it('deve retornar 400 se os dados forem inválidos (Validação do DTO)', () => {
      const invalidDto = {
        email: 'email-invalido',
        // faltando campos obrigatórios
      };

      // Chamada ao endpoint de registro com dados inválidos
      return request(app.getHttpServer() as App)
        .post('/v1/auth/registration')
        .send(invalidDto)
        .expect(400);
    });
  });

  // Testes para o endpoint de login
  describe('/v1/auth/login (POST)', () => {
    // Teste para login bem-sucedido
    it('deve retornar 200 e os tokens ao fazer login', () => {
      const loginDto = {
        email: 'teste@teste.com',
        password: 'password123',
      };

      // Mock da resposta do serviço de autenticação
      mockAuthService.login.mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { email: 'teste@teste.com' },
      });

      // Chamada ao endpoint de login e verificação da resposta
      return request(app.getHttpServer() as App)
        .post('/v1/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          const body = res.body as Record<string, any>;
          expect(body.accessToken).toBeDefined();
          expect(body.user.email).toBe('teste@teste.com');
        });
    });
  });
});
