/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
  ExecutionContext,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { WorkOrderService } from './../src/modules/work-order/work-order.service';
import { JwtAuthGuard } from './../src/modules/auth/guards/access-token.guard';
import { RolesGuard } from './../src/modules/auth/guards/roles.guard';

// Teste de ponta a ponta (e2e) para o WorkOrderController
describe('WorkOrder (e2e)', () => {
  let app: INestApplication;

  // Mock do WorkOrderService para isolar os testes
  const mockWorkOrderService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  // Configuração antes de cada teste
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(WorkOrderService)
      .useValue(mockWorkOrderService)
      // Mock dos Guards para facilitar o teste das rotas
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { sub: 'user-id', shopId: 'shop-id' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
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

  // Testes para o endpoint de ordens de serviço
  describe('/v1/work-orders (GET)', () => {
    // Teste para listar ordens de serviço
    it('deve retornar lista de ordens de serviço', () => {
      mockWorkOrderService.findAll.mockResolvedValue([
        { id: '1', protocolo: 'PROT-001' },
      ]);

      // Chamada ao endpoint de listagem e verificação da resposta
      return request(app.getHttpServer() as App)
        .get('/v1/work-orders')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          const body = res.body as any[];
          expect(body[0].protocolo).toBe('PROT-001');
        });
    });
  });

  // Testes para o endpoint de criação de ordens de serviço
  describe('/v1/work-orders (POST)', () => {
    // Teste para criar uma nova ordem de serviço
    it('deve criar uma ordem de serviço', () => {
      const createDto = {
        description: 'Troca de pneu',
        status: 'OPEN',
        services: [{ name: 'Pneu', currentPrice: 200 }],
      };

      // Mock da resposta do serviço de ordens de serviço
      mockWorkOrderService.create.mockResolvedValue({
        id: 'new-id',
        ...createDto,
      });

      // Chamada ao endpoint de criação e verificação da resposta
      return request(app.getHttpServer() as App)
        .post('/v1/work-orders')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          const body = res.body as Record<string, any>;
          expect(body.id).toBe('new-id');
          expect(body.description).toBe('Troca de pneu');
        });
    });
  });
});
