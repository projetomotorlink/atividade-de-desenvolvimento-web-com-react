import { Transform, TransformFnParams } from 'class-transformer';

// Decorator para remover espaços extras de strings
export function Trim() {
  return Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value,
  );
}
