import { API_BASE_URL } from '~/config/api';
import { authService } from '~/services/auth.services';
import type { ApiError as ApiErrorType } from '~/services/interfaces/api.interface';
import type {
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
  WorkOrder,
} from '~/services/interfaces/work-order.interface';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Todos os comentários em português foram feitos para melhor compreensão do código.

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = authService.getAccessToken();

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  };

  // Faz a requisição inicial
  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Se a resposta for 401, tenta renovar o token de acesso
  if (response.status === 401) {
    const refreshed = await authService.refreshAccessToken();

    // Se a renovação for bem-sucedida, refaz a requisição com o novo token
    if (refreshed) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${refreshed.accessToken}`,
      };
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } else {
      // Se a renovação falhar, redireciona para a página de login
      window.location.href = '/entrar';
      throw new ApiError(401, 'Sessão expirada');
    }
  }

  // Se a resposta não for OK, lança um erro com a mensagem apropriada
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiErrorType;
    throw new ApiError(
      response.status,
      errorData.message || 'Erro na requisição',
    );
  }

  // Se a resposta for 204 retorna null como valor
  if (response.status === 204) {
    return null as T;
  }

  // Retorna os dados da resposta como o tipo esperado
  return response.json() as Promise<T>;
}

// Realiza operações relacionadas a ordens de serviço
export const workOrderService = {
  // Obtém todas as ordens de serviço
  async getAll(): Promise<WorkOrder[]> {
    return apiRequest<WorkOrder[]>('/work-orders');
  },

  // Cria uma nova ordem de serviço
  async create(data: CreateWorkOrderDto): Promise<WorkOrder> {
    return apiRequest<WorkOrder>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Atualiza uma ordem de serviço existente
  async update(id: string, data: UpdateWorkOrderDto): Promise<WorkOrder> {
    return apiRequest<WorkOrder>(`/work-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Deleta uma ordem de serviço
  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/work-orders/${id}`, {
      method: 'DELETE',
    });
  },
};
