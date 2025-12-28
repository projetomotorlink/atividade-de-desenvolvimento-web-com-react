import type { BadgeProps } from '~/services/interfaces/components.interface';

// Componente Badge para exibir o status com estilo
export function Badge({ children, status }: BadgeProps) {
  const getStatusStyles = (s?: string) => {
    switch (s) {
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(status)}`}
    >
      {children}
    </span>
  );
}
