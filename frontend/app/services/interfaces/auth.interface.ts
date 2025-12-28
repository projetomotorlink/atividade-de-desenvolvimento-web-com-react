import type { User } from './user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  shopName: string;
  email: string;
  password1: string;
  password2: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegistrationResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
  shop: {
    id: string;
    shopName: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
