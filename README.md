# Controle Financeiro

Aplicação full stack para organizar contas, receitas, despesas, transferências e
orçamentos pessoais. O projeto está sendo desenvolvido em seis partes, com foco
em arquitetura organizada, segurança, regras de negócio e testes automatizados.

## Tecnologias

### Interface

- React 19
- TypeScript
- Vite
- React Router
- Recharts
- CSS

### API e banco de dados

- Node.js
- NestJS
- PostgreSQL
- Prisma ORM
- Zod

### Qualidade e infraestrutura

- Jest
- Vitest
- Docker Compose
- Nginx
- GitHub Actions
- Helmet e rate limiting
- ESLint e Prettier
- AWS, prevista para a etapa de publicação

## Progresso

- [x] Parte 1 — Estrutura, planejamento e domínio inicial
- [x] Parte 2 — PostgreSQL, Prisma e autenticação
- [x] Parte 3 — Contas, categorias e movimentações
- [x] Parte 4 — Dashboard, filtros e orçamentos
- [x] Parte 5 — Testes, segurança, responsividade e Docker
- [ ] Parte 6 — Revisão, demonstração, documentação e AWS

## Funcionalidades atuais

- Cadastro de usuário.
- Login e logout.
- Sessão persistente por cookie seguro e inacessível ao JavaScript.
- Proteção das páginas privadas da interface.
- Senhas protegidas com hash `scrypt`, salt individual e comparação segura.
- Tokens de sessão aleatórios; apenas o hash do token é salvo no banco.
- Validação dos dados recebidos com Zod.
- Política de senhas com tamanho mínimo, letra maiúscula, minúscula e número.
- Limite global de requisições e limites específicos no cadastro e no login.
- Proteção contra requisições de escrita originadas de sites não autorizados.
- Cabeçalhos HTTP de segurança e limite de tamanho para o corpo das requisições.
- Cadastro, ativação e desativação de contas.
- Saldo atualizado a partir das receitas, despesas e transferências concluídas.
- Categorias iniciais criadas automaticamente para cada usuário.
- Cadastro e ativação ou desativação de categorias personalizadas.
- Registro de receitas, despesas e transferências.
- Movimentações concluídas, pendentes ou canceladas.
- Histórico com filtros processados pela API por período, tipo, situação e conta.
- Dashboard mensal calculado a partir dos dados reais do usuário.
- Gráficos de fluxo financeiro e despesas por categoria.
- Planejamento mensal de limites por categoria.
- Comparação automática entre valor planejado, gasto e disponível.
- Rota de saúde da API.
- Testes unitários da API e da interface, além do teste de integração da API.
- Pipeline de integração contínua para lint, testes e build em cada alteração.
- Execução completa com containers para interface, API e PostgreSQL.
- Modelo relacional preparado para usuários, contas, categorias, movimentações,
  recorrências, orçamentos e sessões.

## Estrutura

```text
controle-financeiro/
├── .github/
│   └── workflows/ci.yml             # Validação automática no GitHub
├── apps/
│   ├── web/
│   │   ├── Dockerfile
│   │   ├── nginx.conf               # Servidor da interface e proxy da API
│   │   └── src/
│   │       ├── app/                 # Rotas da aplicação
│   │       ├── components/          # Componentes de interface e autenticação
│   │       ├── contexts/            # Estado global da autenticação
│   │       ├── features/            # Funcionalidades organizadas por domínio
│   │       ├── pages/               # Páginas da aplicação
│   │       ├── services/            # Comunicação com a API
│   │       ├── styles/              # Estilos globais
│   │       └── types/               # Tipos da interface
│   └── api/
│       ├── Dockerfile
│       ├── prisma/
│       │   ├── migrations/           # Histórico versionado do banco
│       │   └── schema.prisma         # Modelo do PostgreSQL
│       └── src/
│           ├── accounts/             # Contas e cálculo dos saldos
│           ├── auth/                 # Cadastro, login, sessão e proteção de rota
│           ├── budgets/              # Limites mensais por categoria
│           ├── categories/           # Categorias padrão e personalizadas
│           ├── common/               # Recursos compartilhados
│           ├── config/               # Validação das variáveis de ambiente
│           ├── database/             # Integração entre Prisma e PostgreSQL
│           ├── dashboard/            # Indicadores e séries dos gráficos
│           ├── domain/               # Entidades, enums e regras financeiras
│           └── transactions/         # Movimentações e validações
├── docker-compose.yml
├── package.json
└── README.md
```

## Banco de dados

Os valores monetários são representados em centavos para evitar problemas de
precisão. Cada registro financeiro possui relação com seu usuário, garantindo a
separação dos dados entre as contas cadastradas.

No modo de desenvolvimento, o PostgreSQL é disponibilizado na porta `5434`,
evitando conflitos com uma possível instalação local na porta padrão `5432`.

## Como executar com Docker

Esta é a forma mais rápida de iniciar a aplicação completa. Com o Docker Desktop
aberto e o mecanismo Linux em execução, use:

```powershell
docker compose up --build -d
```

O comando cria o banco, aplica as migrações, inicia a API e publica a interface
com Nginx. Aguarde os serviços ficarem saudáveis e acesse:

```text
Aplicação: http://localhost:8080
API:       http://localhost:3333/api
Saúde:     http://localhost:3333/api/health
```

Para acompanhar a inicialização ou encerrar os containers:

```powershell
docker compose ps
docker compose logs -f api
docker compose down
```

O banco é mantido no volume `controle_financeiro_data`. As credenciais presentes
no Compose são destinadas somente ao ambiente local.

## Como executar em desenvolvimento

### Requisitos

- Node.js 24 ou superior
- npm
- Docker Desktop com o mecanismo Linux em execução

### 1. Instale as dependências

Na pasta principal do projeto:

```powershell
npm.cmd install
```

### 2. Configure a API

```powershell
Copy-Item apps\api\.env.example apps\api\.env
```

O arquivo de exemplo já possui os dados necessários para o ambiente local. Não
adicione o arquivo `.env` ao Git.

### 3. Inicie somente o PostgreSQL

```powershell
docker compose up -d database
```

### 4. Crie as tabelas

```powershell
npm.cmd run db:migrate
```

Quando o Prisma solicitar um nome para uma nova migração, use uma descrição
curta, como `add_accounts`. A primeira migração do projeto já está versionada.

### 5. Inicie o projeto

Em um terminal:

```powershell
npm.cmd run dev:api
```

Em outro terminal:

```powershell
npm.cmd run dev:web
```

Endereços locais:

```text
Interface: http://localhost:5173
API:       http://localhost:3333/api
Saúde:     http://localhost:3333/api/health
```

Ao acessar a interface pela primeira vez, utilize a página de cadastro para
criar seu usuário.

## Rotas de autenticação

| Método | Rota | Finalidade |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Cria usuário e inicia uma sessão. |
| `POST` | `/api/auth/login` | Valida as credenciais e inicia uma sessão. |
| `POST` | `/api/auth/logout` | Encerra a sessão atual. |
| `GET` | `/api/auth/me` | Retorna o usuário autenticado. |
| `GET` | `/api/health` | Verifica a disponibilidade da API. |

## Rotas financeiras

Todas as rotas desta seção exigem uma sessão autenticada.

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/api/accounts` | Lista as contas e seus saldos atuais. |
| `POST` | `/api/accounts` | Cadastra uma conta. |
| `PATCH` | `/api/accounts/:id` | Atualiza ou altera a situação da conta. |
| `GET` | `/api/categories` | Lista as categorias do usuário. |
| `POST` | `/api/categories` | Cadastra uma categoria personalizada. |
| `PATCH` | `/api/categories/:id` | Atualiza ou altera a situação da categoria. |
| `GET` | `/api/transactions` | Lista e filtra as movimentações. |
| `POST` | `/api/transactions` | Registra uma movimentação. |
| `PATCH` | `/api/transactions/:id/cancel` | Cancela uma movimentação. |
| `GET` | `/api/budgets` | Lista os orçamentos de determinado mês. |
| `PUT` | `/api/budgets` | Cria ou atualiza um limite mensal. |
| `DELETE` | `/api/budgets/:id` | Remove um orçamento. |
| `GET` | `/api/dashboard` | Retorna o resumo e os gráficos do período. |

## Comandos úteis

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run test
npm.cmd run test:e2e --workspace=@controle-financeiro/api
npm.cmd run db:generate
npm.cmd run db:studio
docker compose down
```

## Próxima etapa

A Parte 6 fará a revisão final, preparará dados de demonstração e documentação
de entrega e definirá a estratégia de publicação na AWS.

## Autor

Desenvolvido por Marcus Bomfim.
