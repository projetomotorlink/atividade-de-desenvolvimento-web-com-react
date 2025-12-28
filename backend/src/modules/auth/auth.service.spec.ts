/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/entities/user.entity';

// Teste unitário para AuthService
describe('AuthService', () => {
  let service: AuthService;

  // Mocks do repositório do AuthService
  const mockUserService = {
    findByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
    findById: jest.fn(),
  };

  // Mock para JwtService
  const mockJwtService = {
    sign: jest.fn(),
  };

  // Mock para ConfigService
  const mockConfigService = {
    getOrThrow: jest.fn(),
    get: jest.fn(),
  };

  // Mock para DataSource e QueryRunner
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
    },
  };

  // Mock para DataSource
  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  // Configuração do módulo de teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // Teste para verificar se o serviço está definido
  it('deve estar instanciado corretamente', () => {
    expect(service).toBeDefined();
  });

  // Testes para o método de registro
  describe('registration', () => {
    // Teste para senhas não coincidentes
    it('deve lançar erro se as senhas não coincidirem', async () => {
      const registrationDto = {
        email: 'test@test.com',
        password1: '123',
        password2: '456',
        firstName: 'Test',
        lastName: 'User',
        shopName: 'Test Shop',
      };

      await expect(
        service.registration(registrationDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    // Teste para registro bem-sucedido
    it('deve registrar um usuário com sucesso', async () => {
      const registrationDto = {
        email: 'test@test.com',
        password1: '123456',
        password2: '123456',
        firstName: 'Test',
        lastName: 'User',
        shopName: 'Test Shop',
      };

      const mockShop = { id: 'shop-id', shopName: 'Test Shop' };
      const mockUser = {
        id: 'user-id',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.ADMIN,
        shop: mockShop,
      };

      mockQueryRunner.manager.save
        .mockResolvedValueOnce(mockShop)
        .mockResolvedValueOnce(mockUser);

      mockQueryRunner.manager.create
        .mockReturnValueOnce(mockShop)
        .mockReturnValueOnce(mockUser);

      mockConfigService.getOrThrow.mockReturnValue('secret');
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await service.registration(registrationDto as any);

      expect(result).toBeDefined();
      expect(result.email).toBe(registrationDto.email);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  // Testes para o método de login
  describe('login', () => {
    // Teste para usuário não encontrado
    it('deve lançar erro se o usuário não for encontrado', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@test.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Teste para senha incorreta
    it('deve realizar login com sucesso', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@test.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.ADMIN,
        shop: { id: 'shop-id', shopName: 'Test Shop' },
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockConfigService.getOrThrow.mockReturnValue('secret');
      mockConfigService.get.mockReturnValue('secret');
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
    });
  });
});
