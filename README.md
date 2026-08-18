# Controle Financeiro

Aplicação full stack para organizar contas, receitas, despesas, transferências e
orçamentos pessoais. O projeto está sendo desenvolvido em seis partes, com foco
em arquitetura organizada, regras de negócio, testes e publicação em nuvem.

## Tecnologias planejadas

### Interface

- React
- TypeScript
- Vite
- CSS
- Lucide React
- Recharts

### API e dados

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod

### Qualidade e infraestrutura

- Jest
- Docker
- AWS

## Progresso

- [x] Parte 1 — Estrutura, planejamento e domínio inicial
- [ ] Parte 2 — PostgreSQL, Prisma e autenticação
- [ ] Parte 3 — Contas, categorias e movimentações
- [ ] Parte 4 — Dashboard, filtros e orçamentos
- [ ] Parte 5 — Testes, segurança, responsividade e Docker
- [ ] Parte 6 — Revisão, demonstração, documentação e AWS

## O que foi criado na Parte 1

- Monorepo gerenciado com npm Workspaces.
- Interface React organizada por componentes, páginas, funcionalidades e tipos.
- API NestJS separada em aplicação, domínio e regras de negócio.
- Primeira versão visual do dashboard com dados demonstrativos.
- Rota `GET /api/health` para verificar a disponibilidade da API.
- Entidades iniciais de usuário, conta, categoria, movimentação, recorrência e
  orçamento.
- Regras para valores monetários, categorias, transferências e cálculo de saldo.
- Testes unitários das principais regras financeiras.

## Estrutura

```text
controle-financeiro/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/                 # Componente principal
│   │       ├── components/          # Componentes compartilhados
│   │       ├── features/            # Funcionalidades por domínio
│   │       ├── pages/               # Páginas da interface
│   │       ├── styles/              # Estilos globais
│   │       └── types/               # Tipos da interface
│   └── api/
│       └── src/
│           └── domain/
│               ├── entities/        # Entidades financeiras
│               ├── enums/           # Tipos controlados do domínio
│               └── rules/           # Regras de negócio testáveis
├── .editorconfig
├── package.json
└── README.md
```

## Modelo inicial

| Entidade | Responsabilidade |
| --- | --- |
| Usuário | Proprietário das informações financeiras. |
| Conta | Origem ou destino de valores, como conta corrente e dinheiro. |
| Categoria | Classificação de receitas e despesas. |
| Movimentação | Receita, despesa ou transferência entre contas. |
| Recorrência | Modelo para gerar movimentações periódicas. |
| Orçamento | Limite mensal definido para uma categoria. |

## Regras definidas

- Valores monetários são armazenados como números inteiros de centavos.
- Uma movimentação deve possuir valor maior que zero.
- Receitas e despesas precisam de categoria.
- Transferências precisam de contas de origem e destino diferentes.
- Transferências não utilizam categorias de receita ou despesa.
- Somente movimentações concluídas alteram o saldo.
- O saldo é calculado a partir do saldo inicial e das movimentações.
- Cada usuário terá acesso somente aos próprios dados.

## Como executar

Instale todas as dependências na pasta principal:

```powershell
npm.cmd install
```

Em um terminal, execute a interface:

```powershell
npm.cmd run dev:web
```

Em outro terminal, execute a API:

```powershell
npm.cmd run dev:api
```

Endereços locais:

```text
Interface: http://localhost:5173
API:       http://localhost:3333/api/health
```

## Validação

```powershell
npm.cmd run build
npm.cmd run test
npm.cmd run lint
```

## Autor

Desenvolvido por Marcus Bomfim.
