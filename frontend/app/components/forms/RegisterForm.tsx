import { Form } from 'react-router';

import { Button } from '../ui/Button';
import { FormField } from './FormField';

export function RegisterForm() {
  return (
    <Form method="post" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Nome"
          name="firstName"
          placeholder="Digite seu nome"
          required
        />

        <FormField
          label="Sobrenome"
          name="lastName"
          placeholder="Digite seu sobrenome"
          required
        />
      </div>

      <FormField
        label="Nome da Oficina"
        name="shopName"
        placeholder="Ex: Oficina do Carlos"
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        required
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Senha"
          name="password1"
          type="password"
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
        />

        <FormField
          label="Confirmar Senha"
          name="password2"
          type="password"
          placeholder="Digite a senha novamente"
          minLength={6}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="mt-2 w-full !py-3 font-bold tracking-wider uppercase"
      >
        Cadastrar
      </Button>
    </Form>
  );
}
