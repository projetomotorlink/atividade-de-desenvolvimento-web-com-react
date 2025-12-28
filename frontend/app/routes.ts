import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/work-orders/index.tsx'),
  route('ordens-de-servico/novo', 'routes/work-orders/create.tsx'),
  route('inscreva-se', 'routes/auth/register.tsx'),
  route('entrar', 'routes/auth/login.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
