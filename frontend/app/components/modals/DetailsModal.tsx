import type { DetailsModalProps } from '~/services/interfaces/components.interface';
import {
  formatDateTime,
  formatPrice,
  translateStatus,
} from '~/utils/formatters';

import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DetailItem } from '../ui/DetailItem';
import { Modal } from '../ui/Modal';

export function DetailsModal({ order, onClose }: DetailsModalProps) {
  return (
    <Modal
      title={`Detalhes da Ordem #${order.protocolo}`}
      onClose={onClose}
      size="large"
      footer={
        <Button onClick={onClose} variant="secondary" className="!px-8">
          Fechar
        </Button>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DetailItem label="Status">
          <Badge status={order.status}>{translateStatus(order.status)}</Badge>
        </DetailItem>

        <DetailItem label="Protocolo">
          <span className="font-mono font-bold text-indigo-600">
            {order.protocolo}
          </span>
        </DetailItem>

        <DetailItem label="Criado por">
          {order.createdBy.firstName} {order.createdBy.lastName}
        </DetailItem>

        <DetailItem label="Loja">{order.shop.shopName}</DetailItem>

        <DetailItem label="Criado em">
          {formatDateTime(order.createdAt)}
        </DetailItem>

        <DetailItem label="Última atualização">
          {formatDateTime(order.updatedAt)}
        </DetailItem>
      </div>

      <DetailItem label="Descrição" className="mb-6">
        <p className="leading-relaxed text-gray-700">{order.description}</p>
      </DetailItem>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <h3 className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Serviços Executados
        </h3>
        <ul className="space-y-3">
          {order.services.map((service) => (
            <li
              key={service.id}
              className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm last:border-0 last:pb-0"
            >
              <span className="font-medium text-gray-700">{service.name}</span>
              <span className="font-bold text-gray-900">
                R$ {formatPrice(service.currentPrice)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-gray-200 pt-4">
          <span className="font-bold text-gray-900">Valor Total</span>
          <span className="text-xl font-black text-indigo-600">
            R$ {formatPrice(order.WorkOrderTotalPrice)}
          </span>
        </div>
      </div>
    </Modal>
  );
}
