import type { DetailItemProps } from '~/services/interfaces/components.interface';

export function DetailItem({
  label,
  children,
  className = '',
}: DetailItemProps) {
  return (
    <div className={`border border-gray-100 bg-gray-50 p-3 ${className}`}>
      <span className="mb-1 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      <div className="text-sm font-medium text-gray-900">
        {typeof children === 'string' ? <span>{children}</span> : children}
      </div>
    </div>
  );
}
