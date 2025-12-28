import { type FormFieldProps } from '~/services/interfaces/components.interface';

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className = '',
  id,
  type,
  required,
  ...props
}: FormFieldProps) {
  // Determine o ID do campo com base nas props fornecidas
  const fieldId = id || htmlFor || props.name;

  // Classes padrao para o input
  const defaultInputClasses =
    'block w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-indigo-500';

  // Se o tipo for 'hidden', renderiza apenas um input hidden
  if (type === 'hidden') {
    return <input id={fieldId} type="hidden" {...(props as any)} />;
  }

  return (
    <div className={`mb-4 flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {/* Este padrão permite a renderização condicional do input ou de um componente
          filho personalizado, permitindo assim o aproveitamento do label */}
        {children || (
          <input
            id={fieldId}
            type={type}
            className={defaultInputClasses}
            required={required}
            {...(props as any)}
          />
        )}
      </div>
      {error && (
        <p
          className="mt-1 text-xs font-medium text-red-600"
          id={fieldId ? `${fieldId}-error` : undefined}
        >
          {error}
        </p>
      )}
    </div>
  );
}
