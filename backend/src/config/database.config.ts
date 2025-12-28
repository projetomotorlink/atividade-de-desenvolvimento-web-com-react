import { registerAs } from '@nestjs/config';

// Configuração do banco de dados usando variáveis de ambiente
export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // synchronize: process.env.NODE_ENV === 'development',
  // logging: true,
}));

export type DatabaseConfig = ReturnType<
  typeof import('./database.config').default
>;
