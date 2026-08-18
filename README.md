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
- CSS

### API e banco de dados

- Node.js
- NestJS
- PostgreSQL
- Prisma ORM
- Zod

### Qualidade e infraestrutura

- Jest
- Docker Compose
- ESLint e Prettier
- AWS, prevista para a etapa de publicação

## Progresso

- [x] Parte 1 — Estrutura, planejamento e domínio inicial
- [x] Parte 2 — PostgreSQL, Prisma e autenticação
- [ ] Parte 3 — Contas, categorias e movimentações
- [ ] Parte 4 — Dashboard, filtros e orçamentos
- [ ] Parte 5 — Testes, segurança, responsividade e Docker
- [ ] Parte 6 — Revisão, demonstração, documentação e AWS

## Funcionalidades atuais

- Cadastro de usuário.
- Login e logout.
- Sessão persistente por cookie seguro e inacessível ao JavaScript.
- Proteção das páginas privadas da interface.
- Senhas protegidas com hash `scrypt`, salt individual e comparação segura.
- Tokens de sessão aleatórios; apenas o hash do token é salvo no banco.
- Validação dos dados recebidos com Zod.
- Dashboard inicial com dados demonstrativos.
- Rota de saúde da API.
- Modelo relacional preparado para usuários, contas, categorias, movimentações,
  recorrências, orçamentos e sessões.

## Estrutura

```text
controle-financeiro/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/                 # Rotas da aplicação
│   │       ├── components/          # Componentes de interface e autenticação
│   │       ├── contexts/            # Estado global da autenticação
│   │       ├── features/            # Funcionalidades organizadas por domínio
│   │       ├── pages/               # Login, cadastro e dashboard
│   │       ├── services/            # Comunicação com a API
│   │       ├── styles/              # Estilos globais
│   │       └── types/               # Tipos da interface
│   └── api/
│       ├── prisma/
│       │   ├── migrations/           # Histórico versionado do banco
│       │   └── schema.prisma         # Modelo do PostgreSQL
│       └── src/
│           ├── auth/                 # Cadastro, login, sessão e proteção de rota
│           ├── common/               # Recursos compartilhados
│           ├── config/               # Validação das variáveis de ambiente
│           ├── database/             # Integração entre Prisma e PostgreSQL
│           └── domain/               # Entidades, enums e regras financeiras
├── docker-compose.yml
├── package.json
└── README.md
```

## Banco de dados

Os valores monetários são representados em centavos para evitar problemas de
precisão. Cada registro financeiro possui relação com seu usuário, garantindo a
separação dos dados entre as contas cadastradas.

O PostgreSQL local é iniciado pelo Docker Compose na porta `5434`, evitando
conflitos com uma possível instalação local na porta padrão `5432`.

## Como executar

### Requisitos

- Node.js 22 ou superior
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

### 3. Inicie o PostgreSQL

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

A Parte 3 implementará o cadastro e gerenciamento de contas, categorias e
movimentações financeiras utilizando os dados reais do usuário autenticado.

## Autor

Desenvolvido por Marcus Bomfim.
