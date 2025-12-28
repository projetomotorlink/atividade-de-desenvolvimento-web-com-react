import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
  Logger,
} from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Helmet para proteger cabeçalhos HTTP
  app.use(helmet());

  // Configuração do CORS
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validação automática das requisições
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  // Serialização automática das respostas
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Versionamento da API
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configuração do Swagger (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(
        'Motorlink API - Sistema de Gerenciamento de Atendimento e Ordens de Serviço para Oficinas Mecânicas',
      )
      .setDescription('API de gerenciamento de ordens de serviço.')
      .setVersion('0.6.0')
      .addTag(
        'Autenticação',
        'Endpoints de autenticação e gerenciamento de tokens JWT',
      )
      .addTag('Ordens de Serviço', 'Gerenciamento de ordens de serviço')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Digite o Access Token JWT (sem o prefixo "Bearer")',
          in: 'header',
        },
        'accessToken',
      )
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Digite o Refresh Token JWT (sem o prefixo "Bearer")',
          in: 'header',
        },
        'refreshToken',
      )
      .build();

    // Criação do documento Swagger
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
      customSiteTitle: 'API Docs - Motorlink',
    });
  }

  // Define a porta de escuta
  const port = process.env.BACKEND_PORT || 3000;

  // Inicia o servidor
  await app.listen(port);

  // Obtém a URL do servidor
  const url = await app.getUrl();

  // Loga a URL de acesso
  logger.log(`🚀 API rodando em: ${url}`);

  // Loga a URL do Swagger em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`📄 Swagger disponível em: ${url}/docs`);
  }
}

// Inicia a aplicação
void bootstrap();
