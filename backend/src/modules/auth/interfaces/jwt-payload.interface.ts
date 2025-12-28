// Define o formato dos dados que serão codificados e armazenados dentro do seu JSON Web Token (JWT)
export interface JwtPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  shopId: string | null;
  shopName: string | null;
  iat?: number;
  exp?: number;
}

// Define o formato dos dados específicos para o token de refresh
export interface JwtRefreshPayload {
  sub: string;
  iat?: number;
  exp?: number;
}
