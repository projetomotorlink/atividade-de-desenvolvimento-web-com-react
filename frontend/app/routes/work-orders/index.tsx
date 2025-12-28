import { useState } from 'react';

import { type ClientLoaderFunctionArgs, redirect } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { DeleteModal } from '~/components/modals/DeleteModal';
import { DetailsModal } from '~/components/modals/DetailsModal';
import { EditModal } from '~/components/modals/EditModal';
import { EmptyState } from '~/components/ui/EmptyState';
import { Navbar } from '~/components/ui/Navbar';
import { WorkOrderTable } from '~/components/ui/WorkOrderTable';
import { workOrderService } from '~/services/api.services';
import { authService } from '~/services/auth.services';
import { type WorkOrder } from '~/services/interfaces/work-order.interface';

export async function clientLoader({
  request: _request,
}: ClientLoaderFunctionArgs) {
  // Verifica autenticação
  if (!authService.isAuthenticated()) {
    return redirect('/entrar');
  }

  try {
    // Carrega as ordens de serviço
    const workOrders = await workOrderService.getAll();

    // Retorna os dados para o componente
    return { workOrders };
  } catch (error: unknown) {
    // Em caso de erro, loga e retorna lista vazia
    console.error('Erro ao carregar ordens de serviço:', error);

    // Retorna lista vazia em caso de erro
    return { workOrders: [] as WorkOrder[] };
  }
}

export default function IndexPage() {
  // Carrega os dados usando o loader
  const { workOrders } = useLoaderData<typeof clientLoader>();

  // Estados criados para controle dos modais
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Função para abrir modal de detalhes
  const openDetailsModal = (order: WorkOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Função para abrir modal de edição
  const openEditModal = (order: WorkOrder) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // Função para abrir modal de exclusão
  const openDeleteModal = (order: WorkOrder) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // Função para fechar todos os modais
  const closeModals = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Ordens de Serviço
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie e acompanhe todas as manutenções na sua oficina
            </p>
          </div>
          <Link
            to="/ordens-de-servico/novo"
            className="inline-flex items-center justify-center border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#fff"
              >
                <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v258q-17.1-5.76-35.1-9.92T744-502v-242H216v528h241q1.88 19.52 5.94 37.26Q467-161 473-144H216Zm0-96v24-528 242-2 264Zm72-48h172q4-19 10.19-36.97Q476.38-342.93 484-360H288v72Zm0-156h264q26-20 56-34.5t64-20.5v-17H288v72Zm0-156h384v-72H288v72ZM719.77-48Q640-48 584-104.23q-56-56.22-56-136Q528-320 584.23-376q56.22-56 136-56Q800-432 856-375.77q56 56.22 56 136Q912-160 855.77-104q-56.22 56-136 56ZM696-144h48v-72h72v-48h-72v-72h-48v72h-72v48h72v72Z" />
              </svg>
            </span>{' '}
            Nova Ordem
          </Link>
        </div>

        <div className="overflow-hidden border border-gray-100 bg-white shadow-sm">
          {/*
           * Este trecho de código verifica se a lista de ordens de serviço está vazia.
           * Se estiver vazia (length === 0), renderiza o componente de "Estado Vazio" para feedback ao usuário.
           * Caso contrário, renderiza a tabela com os dados e as funções de manipulação (ver, editar, excluir).
           */}

          {workOrders.length === 0 ? (
            <div className="py-12">
              <EmptyState />
            </div>
          ) : (
            <WorkOrderTable
              workOrders={workOrders}
              onViewDetails={openDetailsModal}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          )}
        </div>
      </main>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedOrder && (
        <DetailsModal order={selectedOrder} onClose={closeModals} />
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedOrder && (
        <EditModal order={selectedOrder} onClose={closeModals} />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && selectedOrder && (
        <DeleteModal order={selectedOrder} onClose={closeModals} />
      )}
    </div>
  );
}
