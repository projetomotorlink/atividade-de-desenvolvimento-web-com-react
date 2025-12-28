import { useState } from 'react';

import { useRevalidator } from 'react-router';
import { workOrderService } from '~/services/api.services';
import type { DeleteModalProps } from '~/services/interfaces/components.interface';

import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Modal } from '../ui/Modal';

export function DeleteModal({ order, onClose }: DeleteModalProps) {
  // Estado para gerenciar o processo de exclusão
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // Hook para revalidar os dados após a exclusão
  const { revalidate } = useRevalidator();

  // Função para lidar com a exclusão da ordem de serviço
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Chama o serviço para deletar a ordem de serviço
      await workOrderService.delete(order.id);

      // Revalida os dados para atualizar a lista
      void revalidate();
      onClose();
    } catch (err: unknown) {
      // Define a mensagem de erro apropriada
      const message =
        err instanceof Error ? err.message : 'Erro ao deletar ordem de serviço';
      setError(message);
    } finally {
      // Finaliza o estado de exclusão
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      title="Confirmar Exclusão"
      onClose={onClose}
      size="small"
      footer={
        <>
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              void handleDelete();
            }}
            variant="danger"
            isLoading={isDeleting}
            loadingText="Deletando..."
            className="flex-1"
          >
            Sim, Deletar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <ErrorMessage message={error} />}

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-full bg-red-100">
            <img
              src="/assets/images/delete.png"
              alt="Ícone de Lixeira"
              className="w-32 text-red-600"
            />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Deletar Ordem de Serviço
          </h3>
          <p className="text-sm text-gray-500">
            Você tem certeza que deseja excluir a ordem{' '}
            <span className="font-bold text-gray-900">#{order.protocolo}</span>?
          </p>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-3">
          <span className="mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#FB2C36"
            >
              <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
            </svg>
          </span>
          <p className="text-xs leading-relaxed font-medium text-red-700">
            Esta ação é irreversível e todos os dados associados a esta ordem
            serão perdidos. PARA SEMPRE!
          </p>
        </div>
      </div>
    </Modal>
  );
}
