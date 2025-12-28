// As diretrizes abaixo desativam regras específicas do ESLint para este arquivo
/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkOrderController } from './work-order.controller';
import { WorkOrderService } from './work-order.service';

// Testes unitários para o WorkOrderController
describe('WorkOrderController', () => {
  let controller: WorkOrderController;
  let service: WorkOrderService;

  // Mock do WorkOrderService
  const mockWorkOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Configuração do módulo de teste antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderController],
      providers: [
        { provide: WorkOrderService, useValue: mockWorkOrderService },
      ],
    }).compile();

    controller = module.get<WorkOrderController>(WorkOrderController);
    service = module.get<WorkOrderService>(WorkOrderService);
  });

  // Teste para verificar se o controller está definido
  it('deve estar instanciado corretamente', () => {
    expect(controller).toBeDefined();
  });

  // Testes para o método create
  describe('create', () => {
    // Teste para verificar se o service.create é chamado com os parâmetros corretos
    it('deve chamar o service.create com os parâmetros corretos', async () => {
      const createDto = { description: 'Teste' };
      const req = { user: { sub: 'u1', shopId: 's1' } };

      mockWorkOrderService.create.mockResolvedValue({ id: 'wo1' });

      const result = await controller.create(req as any, createDto as any);

      expect(service.create).toHaveBeenCalledWith('u1', 's1', createDto);
      expect(result).toEqual({ id: 'wo1' });
    });
  });

  // Testes para o método findAll
  describe('findAll', () => {
    // Teste para verificar se o service.findAll é chamado com os parâmetros corretos
    it('deve retornar todas as ordens do centro de serviço do usuário', async () => {
      const req = { user: { shopId: 's1' } };
      mockWorkOrderService.findAll.mockResolvedValue([{ id: 'wo1' }]);

      const result = await controller.findAll(req as any);

      expect(service.findAll).toHaveBeenCalledWith('s1');
      expect(result).toEqual([{ id: 'wo1' }]);
    });
  });
});
