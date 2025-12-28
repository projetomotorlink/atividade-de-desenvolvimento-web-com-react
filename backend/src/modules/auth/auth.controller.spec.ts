// A linha abaixo desabilita regras específicas do ESLint para este arquivo
/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Teste unitário para AuthController
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mocks para AuthService
  const mockAuthService = {
    registration: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
  };

  // Configuração do módulo de teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Teste de existência do controller
  it('deve estar instanciado corretamente', () => {
    expect(controller).toBeDefined();
  });

  // Testes para o método de registro
  describe('registration', () => {
    // Teste para verificar a chamada do serviço de registro
    it('deve chamar o service.registration com os dados corretos', async () => {
      const registrationDto = { email: 'test@test.com' };
      const expectedResponse = { user: { email: 'test@test.com' } };

      mockAuthService.registration.mockResolvedValue(expectedResponse);

      const result = await controller.registration(registrationDto as any);

      expect(authService.registration).toHaveBeenCalledWith(registrationDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  // Testes para o método de login
  describe('login', () => {
    // Teste para verificar a chamada do serviço de login
    it('deve chamar o service.login e retornar tokens', async () => {
      const loginDto = { email: 'test@test.com', password: '123' };
      const expectedResponse = { accessToken: 'at', refreshToken: 'rt' };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto as any);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
