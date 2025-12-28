import type { ButtonProps } from '~/services/interfaces/components.interface';

export function Button({
  children,
  variant = 'primary',
  isLoading,
  loadingText,
  className = '',
  ...props
}: ButtonProps) {
  // Define os estilos base do botao
  const baseStyles =
    'cursor-pointer inline-flex items-center justify-center border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

  // Define os estilos para cada variante de botao
  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary:
      'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    link: 'bg-transparent px-0 py-0 text-indigo-600 shadow-none hover:text-indigo-500 hover:underline',
  };

  // Seleciona os estilos da variante apropriada
  const variantClass = variants[variant];

  // Renderiza o botao com os estilos e propriedades apropriadas, além disso, esse botão também possui um estado de carregamento
  // que exibe um spinner e um texto de carregamento quando isLoading é verdadeiro.
  return (
    <button
      className={`${baseStyles} ${variantClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-3 -ml-1 h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {isLoading ? loadingText || 'Carregando...' : children}
    </button>
  );
}
