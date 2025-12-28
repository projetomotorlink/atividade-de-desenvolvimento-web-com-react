import type { WorkOrderTableProps } from '~/services/interfaces/components.interface';
import type { WorkOrder } from '~/services/interfaces/work-order.interface';
import { formatDate, formatPrice, translateStatus } from '~/utils/formatters';

import { Badge } from './Badge';
import { Button } from './Button';

export function WorkOrderTable({
  workOrders,
  onViewDetails,
  onEdit,
  onDelete,
}: WorkOrderTableProps) {
  return (
    <div className="overflow-hidden border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Protocolo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Descrição
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Total
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Criado em
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {workOrders.map((order: WorkOrder) => (
            <tr key={order.id} className="transition-colors hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-indigo-600">
                #{order.protocolo}
              </td>
              <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                {order.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge status={order.status}>
                  {translateStatus(order.status)}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900">
                R$ {formatPrice(order.WorkOrderTotalPrice)}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="space-x-2 px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <Button
                  onClick={() => onViewDetails(order)}
                  variant="link"
                  title="Ver detalhes"
                  className="!p-1 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#2563EB"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm280-80q-82 0-146.5-44.5T240-440q29-71 93.5-115.5T480-600q82 0 146.5 44.5T720-440q-29 71-93.5 115.5T480-280Zm0-60q56 0 102-26.5t72-73.5q-26-47-72-73.5T480-540q-56 0-102 26.5T306-440q26 47 72 73.5T480-340Zm0-100Zm0 60q25 0 42.5-17.5T540-440q0-25-17.5-42.5T480-500q-25 0-42.5 17.5T420-440q0 25 17.5 42.5T480-380Z" />
                  </svg>
                </Button>
                <Button
                  onClick={() => onEdit(order)}
                  variant="link"
                  title="Editar"
                  className="!p-1 text-blue-600 hover:scale-110 hover:text-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#D97706"
                  >
                    <path d="M560-80v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v120h-80v-80H520v-200H240v640h240v80H240Zm280-400Zm241 199-19-18 37 37-18-19Z" />
                  </svg>
                </Button>
                <Button
                  onClick={() => onDelete(order)}
                  variant="link"
                  title="Deletar"
                  className="!p-1 text-red-600 hover:scale-110 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#DC2626"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
