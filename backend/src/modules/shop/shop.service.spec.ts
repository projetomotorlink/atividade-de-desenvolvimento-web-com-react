import { Test, TestingModule } from '@nestjs/testing';
import { ShopService } from './shop.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';

// Configuração de teste para o ShopService
describe('ShopService', () => {
  let service: ShopService;

  // Mock do repositório
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  // Configuração do módulo de teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopService,
        {
          provide: getRepositoryToken(Shop),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ShopService>(ShopService);
  });

  //  Teste para verificar se o serviço está definido
  it('deve estar instanciado corretamente', () => {
    expect(service).toBeDefined();
  });

  // Testes para o método create
  describe('create', () => {
    // Teste para criação bem-sucedida
    it('deve criar uma nova oficina com sucesso', async () => {
      const createShopDto = { shopName: 'Oficina do João' };
      const savedShop = { id: '1', ...createShopDto };

      mockRepository.create.mockReturnValue(savedShop);
      mockRepository.save.mockResolvedValue(savedShop);

      const result = await service.create(createShopDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createShopDto);
      expect(mockRepository.save).toHaveBeenCalledWith(savedShop);
      expect(result).toEqual(savedShop);
    });
  });

  // Testes para o método findById
  describe('findById', () => {
    // Teste para buscar uma oficina pelo ID
    it('deve retornar uma oficina se encontrada', async () => {
      const mockShop = { id: '1', shopName: 'Oficina do João' };
      mockRepository.findOne.mockResolvedValue(mockShop);

      const result = await service.findById('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockShop);
    });

    // Teste para o caso de oficina não encontrada
    it('deve retornar null se a oficina não for encontrada', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });
});
