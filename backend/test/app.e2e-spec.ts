import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// Teste de ponta a ponta (e2e) para o AppController
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  // Configuração antes de cada teste
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Inicialização da aplicação NestJS para testes
    app = moduleFixture.createNestApplication();

    // Inicializa a aplicação
    await app.init();
  });

  it('deve estar instanciado corretamente', () => {
    expect(app).toBeDefined();
  });
});
