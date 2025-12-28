// As diretrizes abaixo desativam algumas regras do ESLint para este arquivo específico
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderService } from './work-order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkOrders } from './entities/work-order.entity';
import { Service } from './entities/service.entity';
import { User } from '../user/entities/user.entity';
import { Shop } from '../shop/entities/shop.entity';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// Testes unitários para o WorkOrderService
describe('WorkOrderService', () => {
  let service: WorkOrderService;
  let workOrderRepo: any;
  let userRepo: any;
  let shopRepo: any;

  // Mock do repositório
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn().mockResolvedValue(0),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(0),
    }),
  };

  // Mock do DataSource
  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    }),
  };

  // Configuração do módulo de teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkOrderService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: getRepositoryToken(WorkOrders), useValue: mockRepo },
        { provide: getRepositoryToken(Service), useValue: mockRepo },
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: getRepositoryToken(Shop), useValue: mockRepo },
      ],
    }).compile();

    // Injeção dos serviços e repositórios mockados
    service = module.get<WorkOrderService>(WorkOrderService);
    workOrderRepo = module.get(getRepositoryToken(WorkOrders));
    userRepo = module.get(getRepositoryToken(User));
    shopRepo = module.get(getRepositoryToken(Shop));
  });

  // Teste de definição do serviço
  it('deve estar instanciado corretamente', () => {
    expect(service).toBeDefined();
  });

  // Testes para o método create
  describe('create', () => {
    // Teste para verificar exceção quando o usuário não existe
    it('deve lançar NotFoundException se o usuário não existir', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create('user-id', 'shop-id', {} as any),
      ).rejects.toThrow(NotFoundException);
    });

    // Teste para verificar a criação bem-sucedida de uma ordem de serviço
    it('deve criar uma ordem de serviço com sucesso', async () => {
      const mockUser = { id: 'user-id' };
      const mockShop = { id: 'shop-id' };
      const createDto = {
        description: 'Troca de óleo',
        status: 'ABERTO',
        services: [{ name: 'Óleo', currentPrice: 100 }],
      };

      userRepo.findOne.mockResolvedValue(mockUser);
      shopRepo.findOne.mockResolvedValue(mockShop);
      workOrderRepo.save.mockResolvedValue({ id: 'wo-id' });

      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'wo-id' } as any);

      const result = await service.create(
        'user-id',
        'shop-id',
        createDto as any,
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('wo-id');
    });
  });

  // Testes para o método findAll
  describe('findAll', () => {
    // Teste para verificar retorno de lista de ordens de serviço
    it('deve retornar lista de ordens de serviço', async () => {
      const mockOrders = [{ id: '1' }, { id: '2' }];
      workOrderRepo.find.mockResolvedValue(mockOrders);

      const result = await service.findAll('shop-id');

      expect(result).toEqual(mockOrders);
      expect(workOrderRepo.find).toHaveBeenCalled();
    });
  });
});
