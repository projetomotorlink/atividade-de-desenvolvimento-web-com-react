#!/bin/sh
set -e

echo "--- Iniciando Entrypoint ---"
echo "DATABASE_HOST: $DATABASE_HOST"
echo "DATABASE_PORT: $DATABASE_PORT"

# Aguarda o banco de dados estar acessível na porta
echo "Aguardando banco de dados em $DATABASE_HOST:$DATABASE_PORT..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  echo "Banco ainda não disponível, aguardando 1s..."
  sleep 1
done

echo "Banco de dados detectado!"

# Aguarda mais alguns segundos para garantir que o PostgreSQL está completamente pronto
echo "Aguardando PostgreSQL estar completamente pronto..."
sleep 5

echo "Executando migrations..."
if npm run m:run; then
  echo "✅ Migrations executadas com sucesso!"
else
  echo "⚠️  Aviso: Falha ao rodar migrations ou nenhuma migration pendente."
  echo "Verifique os logs acima para mais detalhes."
fi

echo "Iniciando aplicação NestJS..."
exec "$@"
