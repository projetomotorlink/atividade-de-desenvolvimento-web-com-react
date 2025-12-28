import type { WorkOrder } from '~/services/interfaces/work-order.interface';

// Função para traduzir o status de uma ordem de serviço
export function translateStatus(status: WorkOrder['status']): string {
  const statusMap: Record<WorkOrder['status'], string> = {
    OPEN: 'Aberta',
    IN_PROGRESS: 'Em Progresso',
    COMPLETED: 'Concluída',
    CANCELLED: 'Cancelada',
  };
  return statusMap[status] || status;
}

// Função para formatar datas
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

// Função para formatar data e hora
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR');
}

// Função para formatar preços
export function formatPrice(value: unknown): string {
  const n = Number(value ?? 0);
  const amount = Number.isNaN(n) ? 0 : n;

  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
