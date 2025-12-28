import { API_BASE_URL } from '~/config/api';

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegistrationRequest,
  RegistrationResponse,
} from './interfaces/auth.interface';
import type { User } from './interfaces/user.interface';

// Serviço de autenticação para login, registro, logout e renovação de tokens
export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Faz a requisição de login para o servidor
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    // Trata erros de login
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    // Processa a resposta de login
    const data = (await response.json()) as LoginResponse;

    // Armazena os tokens e informações do usuário na sessão
    this.setSession(data);

    // Retorna os dados do login
    return data;
  },

  // Registra um novo usuário
  async register(userData: RegistrationRequest): Promise<RegistrationResponse> {
    // Faz a requisição de registro para o servidor
    const response = await fetch(`${API_BASE_URL}/auth/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    // Trata erros de registro
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cadastrar usuário');
    }

    // Retorna a resposta de registro
    return response.json() as Promise<RegistrationResponse>;
  },

  // Faz o logout do usuário
  async logout(): Promise<void> {
    const accessToken = this.getAccessToken();

    try {
      // Informa o servidor sobre o logout
      if (accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error: unknown) {
      // Mesmo em caso de erro, prossegue com o logout local
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Limpa a sessão local e redireciona para a página de login
      this.clearSession();

      // Redireciona para a página de login
      window.location.href = '/entrar';
    }
  },

  // Renova o token de acesso usando o token de refresh
  async refreshAccessToken(): Promise<RefreshTokenResponse | null> {
    // Obtém o token de refresh armazenado
    const refreshToken = this.getRefreshToken();

    // Se não houver token de refresh, retorna null
    if (!refreshToken) {
      return null;
    }

    try {
      // Faz a requisição para renovar o token
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      // Se a renovação falhar, limpa a sessão e redireciona para o login
      if (!response.ok) {
        this.clearSession();
        window.location.href = '/entrar';
        return null;
      }

      // Obtém os novos tokens da resposta
      const data = (await response.json()) as RefreshTokenResponse;

      // Atualiza os tokens na sessão
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);

      return data;
    } catch (error: unknown) {
      console.error('Erro ao renovar token:', error);
      return null;
    }
  },

  // Adiciona os tokens e informações do usuário na sessão
  setSession(data: LoginResponse): void {
    sessionStorage.setItem('accessToken', data.accessToken);
    sessionStorage.setItem('refreshToken', data.refreshToken);
    sessionStorage.setItem('user', JSON.stringify(data.user));
  },

  // Limpa a sessão do usuário
  clearSession(): void {
    sessionStorage.clear();
  },

  // Obtém o token de acesso armazenado
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  },

  // Obtém o token de refresh armazenado
  getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  },

  // Obtém as informações do usuário armazenadas
  getUser(): User | null {
    const userJson = sessionStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as User) : null;
  },

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
