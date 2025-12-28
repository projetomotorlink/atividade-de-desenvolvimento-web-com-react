import {
  type ClientActionFunctionArgs,
  Link,
  redirect,
  useActionData,
} from 'react-router';
import { RegisterForm } from '~/components/forms/RegisterForm';
import { ErrorMessage } from '~/components/ui/ErrorMessage';
import { authService } from '~/services/auth.services';
import type { RegistrationRequest } from '~/services/interfaces/auth.interface';

// Ação no lado do cliente para processar o registro
export async function clientAction({ request }: ClientActionFunctionArgs) {
  // Extrai os dados do formulário
  const formData = await request.formData();

  // Constrói o objeto de dados do usuário
  const userData: RegistrationRequest = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    shopName: formData.get('shopName') as string,
    email: formData.get('email') as string,
    password1: formData.get('password1') as string,
    password2: formData.get('password2') as string,
  };

  try {
    // Chama o serviço de autenticação para registrar o usuário
    await authService.register(userData);

    // Redireciona para a página de login com um parâmetro indicando sucesso
    return redirect('/entrar');
  } catch (error: unknown) {
    // Retorna uma mensagem de erro em caso de falha no registro
    const message =
      error instanceof Error ? error.message : 'Erro ao cadastrar usuário';
    return {
      success: false,
      error: message,
    };
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof clientAction>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 p-4 py-12">
      <div className="w-full max-w-xl space-y-8 border border-gray-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Comece agora
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Crie sua conta na{' '}
            <span className="font-semibold text-indigo-600">Motorlink</span> em
            segundos e comece a organizar sua oficina
          </p>
        </div>

        {actionData && 'error' in actionData && (
          <div className="animate-shake">
            <ErrorMessage message={actionData.error} />
          </div>
        )}

        <div className="border border-gray-100 bg-gray-50/50 p-6">
          <RegisterForm />
        </div>

        <div className="pt-2 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/entrar"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
