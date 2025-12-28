import { Form } from 'react-router';

import { Button } from '../ui/Button';
import { FormField } from './FormField';

export function LoginForm() {
  return (
    <Form method="post" className="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        required
      />

      <FormField
        label="Senha"
        name="password"
        type="password"
        placeholder="Sua senha"
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full !py-3 font-bold tracking-wider uppercase"
      >
        Entrar
      </Button>
    </Form>
  );
}
