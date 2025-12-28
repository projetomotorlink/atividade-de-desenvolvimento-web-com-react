import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '~/components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="animate-in fade-in zoom-in w-full max-w-md space-y-8 text-center duration-500">
        <div className="relative">
          <h1 className="text-[12rem] leading-none font-black text-gray-200 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            <img
              src="/assets/images/map.png"
              alt="Homem com mapa"
              className="w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Está perdido?
          </h2>
          <p className="text-lg text-gray-500">
            A página que você está procurando parece não estar no mapa ou nunca
            existiu.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg ring-2 shadow-indigo-200 transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Voltar para o Início
          </Link>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (location.key !== 'default') {
                void navigate(-1);
              } else {
                void navigate('/');
              }
            }}
            className="!px-8 !py-4 text-base"
          >
            Página Anterior
          </Button>
        </div>

        <div className="pt-12">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Motorlink Software Ltda. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
