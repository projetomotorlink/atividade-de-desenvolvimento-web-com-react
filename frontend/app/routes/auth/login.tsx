import {
  type ClientActionFunctionArgs,
  Link,
  redirect,
  useActionData,
} from 'react-router';
import { LoginForm } from '~/components/forms/LoginForm';
import { ErrorMessage } from '~/components/ui/ErrorMessage';
import { authService } from '~/services/auth.services';

export async function clientAction({ request }: ClientActionFunctionArgs) {
  // Pega os dados do formulario enviado na requisicao
  const formData = await request.formData();

  // Extrai email e senha dos dados do formulario
  const email = formData.get('email') as string;

  // Extrai a senha dos dados do formulario
  const password = formData.get('password') as string;

  try {
    // Tenta fazer login com email e senha fornecidos
    await authService.login({ email, password });

    // Se o login for bem-sucedido, redireciona para a pagina inicial
    return redirect('/');
  } catch (error: unknown) {
    // Se ocorrer um erro durante o login, retorna uma mensagem de erro apropriada
    const message =
      error instanceof Error ? error.message : 'Erro ao fazer login';
    return { success: false, error: message };
  }
}

export default function LoginPage() {
  // Usa o hook useActionData para obter os dados retornados pela acao do cliente
  const actionData = useActionData<typeof clientAction>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 p-4">
      <div className="w-full max-w-md space-y-8 border border-gray-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Bem-vindo a <span className="text-indigo-600">Motorlink</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Acesse sua conta para gerenciar suas ordens de serviço.
          </p>
        </div>

        {actionData && 'error' in actionData && (
          <div className="animate-shake">
            <ErrorMessage message={actionData.error} />
          </div>
        )}

        <LoginForm />

        <div className="pt-4 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/inscreva-se"
              className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Inscreva-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
