import {
  type ActionFunctionArgs,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
  redirect,
  useActionData,
} from 'react-router';
import { WorkOrderForm } from '~/components/forms/WorkOrderForm';
import { ErrorMessage } from '~/components/ui/ErrorMessage';
import { Navbar } from '~/components/ui/Navbar';
import { workOrderService } from '~/services/api.services';
import { authService } from '~/services/auth.services';
import type {
  CreateWorkOrderDto,
  WorkOrderStatus,
} from '~/services/interfaces/work-order.interface';

// Loader do lado do cliente para verificar autenticação
export async function clientLoader({
  request: _request,
}: ClientLoaderFunctionArgs) {
  // Verifica se o usuário está autenticado
  if (!authService.isAuthenticated()) {
    return redirect('/entrar');
  }

  return await Promise.resolve(null);
}

// Action do lado do servidor para processar o formulário
export async function action({ request }: ActionFunctionArgs) {
  // Pega os dados do formulário
  const formData = await request.formData();

  // Constrói o objeto de dados da ordem de serviço
  const servicesJson = formData.get('services') as string | null;

  // Parseia os serviços se existirem
  const services = servicesJson
    ? (JSON.parse(servicesJson) as CreateWorkOrderDto['services'])
    : [];

  // Cria o objeto workOrderData com os dados do formulário
  const workOrderData: CreateWorkOrderDto = {
    description: (formData.get('description') as string) || '',
    services: services,
    status: (formData.get('status') as WorkOrderStatus) || 'OPEN',
  };

  // Retorna os dados da ordem de serviço para a action do cliente
  return { workOrderData };
}

// Action do lado do cliente para criar a ordem de serviço
export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  // Chama a action do servidor para obter os dados do formulário
  const result = (await serverAction()) as any;

  // Verifica se o usuário está autenticado
  if (!authService.isAuthenticated()) {
    return redirect('/entrar');
  }

  // Tenta criar a ordem de serviço
  try {
    // Chama o serviço para criar a ordem de serviço
    await workOrderService.create(result.workOrderData);

    // Redireciona para a página inicial após a criação bem-sucedida
    return redirect('/');
  } catch (error: unknown) {
    // Retorna a mensagem de erro para exibição
    const message =
      error instanceof Error ? error.message : 'Erro ao criar ordem de serviço';
    return {
      success: false,
      error: message,
    };
  }
}

export default function CreatePage() {
  // Pega os dados da action do cliente
  const actionData = useActionData<typeof clientAction>();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Nova Ordem de Serviço
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Preencha os detalhes abaixo para registrar uma nova manutenção
            </p>
          </div>

          {actionData && 'error' in actionData && (
            <div className="animate-shake mb-6">
              <ErrorMessage message={actionData.error} />
            </div>
          )}

          <WorkOrderForm />
        </div>
      </main>
    </div>
  );
}
