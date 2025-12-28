import { Link } from 'react-router';

// Componente que exibe um estado vazio quando não há ordens de serviço
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        <img
          src="/assets/images/folderEmpty.png"
          alt="Nenhuma ordem encontrada"
          className="w-32"
        />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900">
        Nenhuma ordem encontrada
      </h3>
      <p className="mb-6 max-w-xs text-gray-500">
        Você ainda não registrou nenhuma ordem de serviço.
      </p>
      <Link
        to="/ordens-de-servico/novo"
        className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
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
        Criar primeira ordem.
      </Link>
    </div>
  );
}
