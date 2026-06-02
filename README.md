# 🐾 Woofy — Sistema de Gestão para Clínicas Veterinárias

---

## 📋 Índice

1. Explicação do Sistema
2. Estrutura das Pastas
3. Banco de Dados (Entidades e Modelos)
4. Rotas e Páginas (APIs Internas)
5. Tecnologias Utilizadas
6. Passo a Passo de Instalação

---

## 1. 💡 Explicação do Sistema

O **Woofy** é uma plataforma web de gestão inteligente voltada para **clínicas veterinárias**. O sistema foi desenvolvido como projeto final do curso no SENAI e oferece uma interface moderna e responsiva para administrar todos os aspectos operacionais de um negócio pet.

### Objetivo

Centralizar o gerenciamento de uma clínica veterinária em uma única plataforma: desde o cadastro de animais e seus tutores até o controle financeiro, passando por agendamentos, consultas e vacinação.

### Funcionalidades Principais

- **Landing Page institucional** com apresentação da clínica, serviços, equipe, galeria, depoimentos e formulário de contato.
- **Dashboard** com resumo em tempo real: total de pets, consultas do dia, vacinas pendentes e receita mensal, além de gráfico de consultas por dia da semana.
- **Gestão de Pets**: cadastro, edição, arquivamento e busca de animais com suporte a cães, gatos e outros.
- **Consultas**: agendamento, visualização e controle de status (agendada / realizada / cancelada).
- **Vacinação**: registro de vacinas aplicadas e controle de próximas doses.
- **Histórico**: linha do tempo de atendimentos por pet, incluindo consultas, vacinas e exames.
- **Financeiro**: lançamentos de entradas e saídas, com categorias, resumo mensal e balanço.
- **Agenda**: calendário visual de agendamentos por veterinário, data e tipo de serviço.

### Arquitetura

O sistema segue uma arquitetura **frontend-only** (SPA com SSR via Next.js App Router). Não há backend ou banco de dados externo: o estado global é gerenciado via React Context API com dados iniciais mockados em TypeScript. Toda a persistência é em memória durante a sessão.

```
Usuário → Landing Page (marketing)
       → Sistema Interno (dashboard)
              ↓
         AppContext (estado global)
              ↓
         mock-data.ts (dados iniciais)
```

---

## 2. 📁 Estrutura das Pastas

O projeto principal está dentro da pasta `v0-sistema-para-clinica-main/`.

```
Woofy-projetoFinal/
├── README.md
└── v0-sistema-para-clinica-main/
    ├── app/                          # Roteamento Next.js (App Router)
    │   ├── (marketing)/              # Grupo de rotas — Landing Page
    │   │   └── page.tsx              # Página inicial pública
    │   ├── (dashboard)/              # Grupo de rotas — Sistema interno
    │   │   ├── layout.tsx            # Layout com Sidebar para todas as rotas
    │   │   ├── dashboard/page.tsx    # Painel principal com métricas
    │   │   ├── pets/page.tsx         # CRUD de pets
    │   │   ├── consultas/page.tsx    # Gestão de consultas
    │   │   ├── vacinacao/page.tsx    # Controle de vacinas
    │   │   ├── historico/page.tsx    # Histórico clínico
    │   │   ├── financeiro/page.tsx   # Controle financeiro
    │   │   └── agenda/page.tsx       # Agenda/calendário
    │   ├── globals.css               # Estilos globais
    │   └── layout.tsx                # Root layout (providers, fontes, metadata)
    ├── components/
    │   ├── landing/                  # Seções da Landing Page
    │   │   ├── header.tsx
    │   │   ├── hero-section.tsx
    │   │   ├── about-section.tsx
    │   │   ├── services-section.tsx
    │   │   ├── team-section.tsx
    │   │   ├── testimonials-section.tsx
    │   │   ├── gallery-section.tsx
    │   │   ├── contact-section.tsx
    │   │   ├── features-section.tsx
    │   │   ├── pricing-section.tsx
    │   │   ├── stats-section.tsx
    │   │   ├── how-it-works-section.tsx
    │   │   ├── cta-section.tsx
    │   │   ├── dashboard-preview-section.tsx
    │   │   └── footer.tsx
    │   ├── ui/                       # Componentes shadcn/ui (design system)
    │   │   └── (accordion, button, card, dialog, table, etc.)
    │   ├── sidebar.tsx               # Navegação lateral responsiva
    │   ├── theme-provider.tsx        # Provider de tema claro/escuro
    │   └── toast-container.tsx       # Notificações globais
    ├── context/
    │   └── app-context.tsx           # Estado global com React Context + useState
    ├── hooks/
    │   ├── use-mobile.ts             # Hook para detectar telas mobile
    │   └── use-toast.ts              # Hook para toasts/notificações
    ├── lib/
    │   ├── mock-data.ts              # Interfaces TypeScript + dados iniciais
    │   └── utils.ts                  # Utilitários (cn/classnames)
    ├── public/                       # Assets estáticos (logos, ícones, imagens)
    ├── styles/
    │   └── globals.css
    ├── next.config.mjs               # Configuração do Next.js
    ├── tsconfig.json                 # Configuração TypeScript
    ├── package.json                  # Dependências e scripts
    └── components.json               # Configuração shadcn/ui
```

---

## 3. 🗄️ Banco de Dados (Entidades e Modelos)

O sistema não utiliza banco de dados externo. Os dados são definidos como **interfaces TypeScript** no arquivo `lib/mock-data.ts` e carregados no estado global via React Context.

### Entidade: Pet

| Campo            | Tipo      | Descrição                 |
| ---------------- | --------- | ------------------------- |
| `id`             | `string`  | Identificador único       |
| `nome`           | `string`  | Nome do animal            |
| `especie`        | `"cao" \  | "gato" \                  |
| `raca`           | `string`  | Raça                      |
| `dataNascimento` | `string`  | Data de nascimento (ISO)  |
| `peso`           | `number`  | Peso em kg                |
| `tutor`          | `string`  | Nome do tutor/responsável |
| `telefoneTutor`  | `string`  | Telefone do tutor         |
| `foto?`          | `string`  | URL da foto (opcional)    |
| `arquivado?`     | `boolean` | Soft delete (opcional)    |

### Entidade: Consulta

| Campo         | Tipo           | Descrição                    |              |              |
| ------------- | -------------- | ---------------------------- | ------------ | ------------ |
| `id`          | `string`       | Identificador único          |              |              |
| `petId`       | `string`       | Referência ao Pet            |              |              |
| `petNome`     | `string`       | Nome do pet (desnormalizado) |              |              |
| `tutor`       | `string`       | Nome do tutor                |              |              |
| `data`        | `string`       | Data da consulta (ISO)       |              |              |
| `horario`     | `string`       | Horário (HH:MM)              |              |              |
| `veterinario` | `string`       | Nome do veterinário          |              |              |
| `motivo`      | `string`       | Motivo da consulta           |              |              |
| `status`      | `"agendada" \  | "realizada" \                | "cancelada"` | Status atual |

### Entidade: Vacina

| Campo           | Tipo     | Descrição                    |
| --------------- | -------- | ---------------------------- |
| `id`            | `string` | Identificador único          |
| `petId`         | `string` | Referência ao Pet            |
| `petNome`       | `string` | Nome do pet (desnormalizado) |
| `vacina`        | `string` | Nome da vacina               |
| `dataAplicacao` | `string` | Data de aplicação (ISO)      |
| `proximaDose`   | `string` | Data da próxima dose (ISO)   |

### Entidade: HistoricoItem

| Campo         | Tipo           | Descrição                |
| ------------- | -------------- | ------------------------ |
| `id`          | `string`       | Identificador único      |
| `petId`       | `string`       | Referência ao Pet        |
| `data`        | `string`       | Data do registro (ISO)   |
| `tipo`        | `"consulta" \  | "vacina" \               |
| `descricao`   | `string`       | Descrição do atendimento |
| `veterinario` | `string`       | Veterinário responsável  |

### Entidade: Lancamento (Financeiro)

| Campo       | Tipo          | Descrição                            |
| ----------- | ------------- | ------------------------------------ |
| `id`        | `string`      | Identificador único                  |
| `descricao` | `string`      | Descrição do lançamento              |
| `tipo`      | `"entrada" \  | "saida"`                             |
| `valor`     | `number`      | Valor em R$                          |
| `data`      | `string`      | Data do lançamento (ISO)             |
| `categoria` | `string`      | Categoria (Consultas, Vacinas, etc.) |

### Entidade: Agendamento

| Campo           | Tipo     | Descrição                             |
| --------------- | -------- | ------------------------------------- |
| `id`            | `string` | Identificador único                   |
| `petId`         | `string` | Referência ao Pet                     |
| `petNome`       | `string` | Nome do pet (desnormalizado)          |
| `tutor`         | `string` | Nome do tutor                         |
| `data`          | `string` | Data do agendamento (ISO)             |
| `horarioInicio` | `string` | Hora de início (HH:MM)                |
| `horarioFim`    | `string` | Hora de fim (HH:MM)                   |
| `veterinario`   | `string` | Veterinário responsável               |
| `tipo`          | `string` | Tipo (Consulta, Vacinação, Cirurgia…) |

### Estado Global (AppContext)

Todas as entidades são controladas pelo `AppContext` e expostas via hook `useApp()`. Cada entidade possui seu próprio `useState` e setter, permitindo que qualquer página leia ou modifique o estado globalmente durante a sessão.

```tsx
// Uso em qualquer componente:
const { pets, setPets, consultas, addToast } = useApp();
```

---

## 4. 🗺️ Rotas e Páginas

O sistema usa o **App Router do Next.js 16** com grupos de rotas para separar o contexto público (marketing) do sistema interno (dashboard).

### Grupo (marketing) — Público

| Rota | Arquivo                    | Descrição                           |
| ---- | -------------------------- | ----------------------------------- |
| `/`  | `app/(marketing)/page.tsx` | Landing page institucional completa |

### Grupo (dashboard) — Sistema Interno

| Rota          | Arquivo                               | Descrição                                        |
| ------------- | ------------------------------------- | ------------------------------------------------ |
| `/dashboard`  | `app/(dashboard)/dashboard/page.tsx`  | Painel com métricas e gráficos                   |
| `/pets`       | `app/(dashboard)/pets/page.tsx`       | Listagem, criação, edição e arquivamento de pets |
| `/consultas`  | `app/(dashboard)/consultas/page.tsx`  | Gerenciamento de consultas                       |
| `/vacinacao`  | `app/(dashboard)/vacinacao/page.tsx`  | Registro e controle de vacinas                   |
| `/historico`  | `app/(dashboard)/historico/page.tsx`  | Histórico clínico por pet                        |
| `/financeiro` | `app/(dashboard)/financeiro/page.tsx` | Lançamentos e balanço financeiro                 |
| `/agenda`     | `app/(dashboard)/agenda/page.tsx`     | Calendário de agendamentos                       |

> ⚠️ **Nota:** O sistema não possui uma API REST externa. Todas as operações (create, read, update, delete) são realizadas diretamente no estado React via `AppContext`. Não há chamadas HTTP entre páginas.

### Navegação

A Sidebar (`components/sidebar.tsx`) é responsável pela navegação interna. Em dispositivos móveis, ela é exibida como menu hambúrguer. Em desktops, é fixa na lateral esquerda com largura de 64px (256px).

---

## 5. 🛠️ Tecnologias Utilizadas

### Core

| Tecnologia     | Versão | Uso                                  |
| -------------- | ------ | ------------------------------------ |
| **Next.js**    | 16.2.6 | Framework React com App Router e SSR |
| **React**      | 19     | Biblioteca de UI                     |
| **TypeScript** | 5.7.3  | Tipagem estática                     |

### Estilização

| Tecnologia       | Versão    | Uso                                           |
| ---------------- | --------- | --------------------------------------------- |
| **Tailwind CSS** | 4.2.0     | Utilitários CSS                               |
| **shadcn/ui**    | —         | Design System baseado em Radix UI             |
| **Radix UI**     | Múltiplas | Componentes acessíveis (Dialog, Select, etc.) |
| **lucide-react** | 0.564.0   | Biblioteca de ícones SVG                      |
| **next-themes**  | 0.4.6     | Suporte a tema claro/escuro                   |

### Formulários e Validação

| Tecnologia              | Versão | Uso                              |
| ----------------------- | ------ | -------------------------------- |
| **react-hook-form**     | 7.54.1 | Gerenciamento de formulários     |
| **zod**                 | 3.24.1 | Validação de schemas             |
| **@hookform/resolvers** | 3.9.1  | Integração react-hook-form + zod |

### Gráficos e Data

| Tecnologia           | Versão | Uso                              |
| -------------------- | ------ | -------------------------------- |
| **recharts**         | 2.15.0 | Gráficos (BarChart no Dashboard) |
| **date-fns**         | 4.1.0  | Manipulação de datas             |
| **react-day-picker** | 9.13.2 | Componente de calendário         |

### UI Extras

| Tecnologia                 | Versão | Uso                      |
| -------------------------- | ------ | ------------------------ |
| **sonner**                 | 1.7.1  | Notificações toast       |
| **embla-carousel-react**   | 8.6.0  | Carousel/slider          |
| **cmdk**                   | 1.1.1  | Command palette          |
| **vaul**                   | 1.1.2  | Drawer (gaveta) mobile   |
| **react-resizable-panels** | 2.1.7  | Painéis redimensionáveis |

### Fontes

| Fonte        | Uso                               |
| ------------ | --------------------------------- |
| **DM Sans**  | Texto geral (corpo, UI)           |
| **Fraunces** | Títulos e headings (`font-serif`) |

### Deploy e Analytics

| Tecnologia            | Uso                                 |
| --------------------- | ----------------------------------- |
| **@vercel/analytics** | Rastreamento de eventos em produção |
| **Vercel**            | Plataforma de deploy recomendada    |

---

## 6. 🚀 Passo a Passo de Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior → nodejs.org
- **Git** → git-scm.com
- Um gerenciador de pacotes: **npm** (já vem com Node), **yarn** ou **pnpm**

### Passo 1 — Clonar o Repositório

```bash
git clone https://github.com/heloisabolognesi/Woofy-projetoFinal.git
cd Woofy-projetoFinal
```

### Passo 2 — Mudar para o Branch com o Código

O código principal está no branch `Heloisa-Bolognesi`:

```bash
git checkout Heloisa-Bolognesi
```

Você verá a pasta `v0-sistema-para-clinica-main/` no diretório.

### Passo 3 — Entrar na Pasta do Projeto

```bash
cd v0-sistema-para-clinica-main
```

### Passo 4 — Instalar Dependências

Escolha um dos gerenciadores abaixo:

```bash
# Com npm
npm install

# Com yarn
yarn install

# Com pnpm (recomendado — o projeto tem pnpm-lock.yaml)
pnpm install
```

### Passo 5 — Iniciar em Modo de Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

Abra o navegador em **http://localhost:3000**.

Você verá a **Landing Page**. Para acessar o sistema interno, acesse **http://localhost:3000/dashboard**.

### Passo 6 — Build para Produção (opcional)

```bash
npm run build
npm run start
```

### Scripts Disponíveis

| Script          | Comando         | Descrição                                |
| --------------- | --------------- | ---------------------------------------- |
| Desenvolvimento | `npm run dev`   | Inicia servidor com hot-reload           |
| Build           | `npm run build` | Gera build otimizado de produção         |
| Start           | `npm run start` | Inicia o servidor de produção            |
| Lint            | `npm run lint`  | Executa verificação de código com ESLint |

### Possíveis Problemas

**Erro de versão do Node:** O projeto usa React 19 e Next.js 16 — exige Node.js 18+. Verifique com `node --version`.

**Porta em uso:** Caso a porta 3000 esteja ocupada, o Next.js sobe automaticamente na próxima disponível (3001, 3002…).

**Erro de tipos no build:** O `next.config.mjs` tem `ignoreBuildErrors: true` configurado para facilitar o desenvolvimento. Erros de tipo TypeScript não impedem o build.

---

## 🌿 Branches do Repositório

| Branch              | Descrição                        |
| ------------------- | -------------------------------- |
| `main`              | Branch principal (README apenas) |
| `Heloisa-Bolognesi` | Código completo do sistema       |
| `Guilherme-Lima`    | Branch do colaborador            |

---
