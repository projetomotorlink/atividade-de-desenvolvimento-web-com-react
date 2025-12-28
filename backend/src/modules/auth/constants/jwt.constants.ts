// Constantes relacionadas à configuração do JWT
export const JWT_CONFIG_KEYS = {
  ACCESS_SECRET: 'JWT_ACCESS_SECRET',
  REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  ACCESS_EXPIRATION: 'JWT_ACCESS_EXPIRATION',
  REFRESH_EXPIRATION: 'JWT_REFRESH_EXPIRATION',
} as const;

// Valores padrão para configuração do JWT
export const JWT_DEFAULTS = {
  ACCESS_EXPIRATION: '15m',
  REFRESH_EXPIRATION: '7d',
  BCRYPT_ROUNDS: 10,
} as const;

// Nomes das estratégias JWT utilizadas na autenticação
export const JWT_STRATEGIES = {
  ACCESS: 'jwt',
  REFRESH: 'jwt-refresh',
} as const;
