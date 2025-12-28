import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';

// Configuração de teste para o UserService
describe('UserService', () => {
  let service: UserService;

  // Mock do repositório
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    }),
  };

  // Configuração do módulo de teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Teste para verificar se o serviço está definido
  it('deve estar instanciado corretamente', () => {
    expect(service).toBeDefined();
  });

  // Testes para o método create
  describe('create', () => {
    // Teste para senhas não coincidentes
    it('deve lançar erro se as senhas não coincidirem', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password1: '123',
        password2: '456',
      };

      await expect(service.create(createUserDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    // Teste para criação bem-sucedida de usuário
    it('deve criar um usuário com sucesso', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password1: '123456',
        password2: '123456',
        firstName: 'João',
        lastName: 'Silva',
      };

      mockRepository.create.mockReturnValue(createUserDto);
      mockRepository.save.mockResolvedValue({ id: '1', ...createUserDto });

      const result = await service.create(createUserDto as any);

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    // Teste para email já existente
    it('deve lançar ConflictException se o email já existir', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password1: '123456',
        password2: '123456',
      };

      mockRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createUserDto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // Testes para o método findByEmail
  describe('findByEmail', () => {
    // Teste para buscar usuário por email
    it('deve buscar usuário por email usando queryBuilder', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      mockRepository.createQueryBuilder().getOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(mockUser);
    });
  });
});
