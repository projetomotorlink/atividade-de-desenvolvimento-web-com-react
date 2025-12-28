# TODO:
Escrever este README.md antes de entregar a atividade.

## Execução da API (versão temporária)

Para executar a API, primeiro edite o arquivo `.env`. Para isso, copie o arquivo `.env.example` e renomeie para `.env` e, faça as alterações de credenciais que achar ser necessárias.



Então, inicie o banco e dados `PostgreSQL`. É Importante que **tenha o docker instalado** no seu computador.

```bash
docker compose up -d
```

Então, entre na pasta `backend/` usando o comando:

```bash
cd backend
```

Instale os pacotes usando o comando:

```bash
npm install
```

Verifique se o container do banco de dados já está disponível usando o comando:

```bash
docker ps
```

Volte a raiz do projeto e copie o arquivo `.env` para a pasta `backend/`, ela contem as credenciais para o banco de dados. Você pode fazer isso manualmente ou usando o comando abaixo no terminal PowerShell (Windows) ou Bash (Linux) (apenas confira se o seu terminal está na raiz do projeto).

```bash
cp .env backend/
```

Se o container estiver ativo então ele irá aparecer na listagem.

**Importante:** Se for a primeira vez subindo a API, execute as migrações para o banco de dados. O comando é:

```bash
npm run m:run
```

Esse comando é uma alias no `package.json` que irá chamar o TypeORM e irá rodar as migrations criadas na API, criando assim as tabelas no banco de dados.

---

Após isso, inicie a API usando o comando abaixo:

```bash
npm run start:dev
```
Esse comando irá subir a API com configurações de ambiente de desenvolvimento.

Você poderá ver a documentação da API usando o swagger no seguinte endereço:

```bash
http://localhost:3000/docs
```

