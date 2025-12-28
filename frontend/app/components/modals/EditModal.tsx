import { type ChangeEvent, type FormEvent, useState } from 'react';

import { useRevalidator } from 'react-router';
import { workOrderService } from '~/services/api.services';
import type { EditModalProps } from '~/services/interfaces/components.interface';
import type { WorkOrder } from '~/services/interfaces/work-order.interface';

import { FormField } from '../forms/FormField';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Modal } from '../ui/Modal';

export function EditModal({ order, onClose }: EditModalProps) {
  const inputClasses =
    'block w-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-indigo-500';

  // Estado para a descrição do problema
  const [description, setDescription] = useState(order.description);

  // Estado para o status da ordem de serviço
  const [status, setStatus] = useState(order.status);

  // Estado para os serviços associados à ordem de serviço
  const [services, setServices] = useState(
    order.services.map((s) => ({
      name: s.name,
      currentPrice: s.currentPrice,
    })),
  );

  // Estado para controle de loading e erros
  const [isLoading, setIsLoading] = useState(false);

  // Estado para mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // Revalida os dados após a atualização
  const { revalidate } = useRevalidator();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Chama o serviço para atualizar a ordem de serviço
      await workOrderService.update(order.id, {
        description,
        status,
        services,
      });

      // Revalida os dados e fecha o modal
      await revalidate();
      onClose();
    } catch (err: unknown) {
      // Em caso de erro, define a mensagem de erro apropriada
      const message =
        err instanceof Error
          ? err.message
          : 'Erro ao atualizar ordem de serviço';
      setError(message);
    } finally {
      // Define o estado de loading como falso
      setIsLoading(false);
    }
  };

  // Função para adicionar um novo serviço
  const addService = () => {
    setServices([...services, { name: '', currentPrice: 0 }]);
  };

  // Função para remover um serviço pelo índice
  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <Modal
      title={`Editar Ordem #${order.protocolo}`}
      onClose={onClose}
      size="large"
      footer={
        <div className="flex w-full gap-3 sm:w-auto">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
            className="flex-1 sm:min-w-[100px] sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-order-form"
            variant="primary"
            isLoading={isLoading}
            loadingText="Salvando..."
            className="flex-[2] font-bold tracking-wider uppercase sm:min-w-[120px] sm:flex-none"
          >
            Salvar Alterações
          </Button>
        </div>
      }
    >
      <form
        id="edit-order-form"
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-6"
      >
        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <FormField
              label="Descrição do Problema"
              htmlFor="description"
              required
            >
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={inputClasses}
                required
              />
            </FormField>
          </div>
          <div>
            <FormField label="Status Atual" htmlFor="status">
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as WorkOrder['status'])
                }
                className={`${inputClasses} font-semibold`}
              >
                <option value="OPEN">Aberta</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </FormField>
          </div>
        </div>

        <div className="border border-gray-200 bg-gray-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
              Serviços e Orçamentos
            </h3>
            <span className="text-xs font-medium text-gray-500">
              {services.length} {services.length === 1 ? 'serviço' : 'serviços'}
            </span>
          </div>

          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-top-1 flex gap-3 duration-200"
              >
                <div className="flex-1">
                  <FormField
                    placeholder="Nome do serviço"
                    label=""
                    value={service.name}
                    className="mb-0"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const newServices = [...services];
                      newServices[index] = {
                        ...newServices[index],
                        name: e.target.value,
                      };
                      setServices(newServices);
                    }}
                    required
                  />
                </div>
                <div className="w-32">
                  <FormField
                    type="number"
                    step="0.01"
                    placeholder="R$ 0.00"
                    label=""
                    value={service.currentPrice}
                    className="mb-0"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const newServices = [...services];
                      newServices[index] = {
                        ...newServices[index],
                        currentPrice: parseFloat(e.target.value) || 0,
                      };
                      setServices(newServices);
                    }}
                    required
                  />
                </div>
                {services.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeService(index)}
                    variant="danger"
                    className="flex h-[38px] w-[38px] items-center justify-center !p-2.5"
                    title="Remover serviço"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#fff"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={addService}
            variant="secondary"
            className="mt-4 w-full text-xs sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1B1B1B"
            >
              <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v258q-17.1-5.76-35.1-9.92T744-502v-242H216v528h241q1.88 19.52 5.94 37.26Q467-161 473-144H216Zm0-96v24-528 242-2 264Zm72-48h172q4-19 10.19-36.97Q476.38-342.93 484-360H288v72Zm0-156h264q26-20 56-34.5t64-20.5v-17H288v72Zm0-156h384v-72H288v72ZM719.77-48Q640-48 584-104.23q-56-56.22-56-136Q528-320 584.23-376q56.22-56 136-56Q800-432 856-375.77q56 56.22 56 136Q912-160 855.77-104q-56.22 56-136 56ZM696-144h48v-72h72v-48h-72v-72h-48v72h-72v48h72v72Z" />
            </svg>
            Adicionar Novo Serviço
          </Button>
        </div>
      </form>
    </Modal>
  );
}
