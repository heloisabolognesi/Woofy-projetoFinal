# 🐾 Woofy — Sistema de Gestão para Clínica Veterinária

Woofy é um sistema web para gestão de clínicas veterinárias, permitindo controlar pets, tutores, consultas, vacinação, agenda e financeiro em um só lugar. Construído com **Next.js 16 (App Router)**, **React 19**, **TypeScript** e **Supabase** (autenticação + banco de dados Postgres com Row Level Security).

> Projeto final desenvolvido por [Heloísa Bolognesi](https://github.com/heloisabolognesi).

---

## 📋 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Modelo de dados](#-modelo-de-dados)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar o projeto localmente](#-como-rodar-o-projeto-localmente)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Autenticação e segurança](#-autenticação-e-segurança)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 📖 Sobre o projeto

O **Woofy** foi criado para simplificar o dia a dia de clínicas veterinárias, centralizando o cadastro de pets e tutores, o controle de consultas e vacinas, a agenda da clínica e o fluxo financeiro (entradas e saídas). O sistema conta com uma landing page pública e uma área logada (dashboard) protegida por autenticação, onde cada usuário só visualiza e gerencia os próprios dados.

---

## ✨ Funcionalidades

- **🔐 Autenticação** — cadastro e login de usuários via Supabase Auth, com criação automática de perfil (trigger no banco).
- **🐶 Cadastro de Pets** — nome, espécie (cão, gato ou outro), raça, data de nascimento, peso, tutor, telefone e foto, com opção de arquivar pets.
- **🩺 Consultas** — agendamento de consultas com data, horário, veterinário responsável e motivo, com status (`agendada`, `realizada`, `cancelada`).
- **💉 Vacinação** — controle de vacinas aplicadas e datas da próxima dose por pet.
- **📜 Histórico** — linha do tempo de eventos por pet (consultas, vacinas, exames).
- **📅 Agenda** — visualização e organização dos horários da clínica por veterinário.
- **💰 Financeiro** — lançamentos de entradas e saídas por categoria, com data e valor.
- **📊 Dashboard** — visão geral com indicadores da clínica.
- **📱 Interface responsiva** — construída com Tailwind CSS e componentes Radix UI/shadcn.

---

## 🛠 Tecnologias utilizadas

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (validação de formulários)
- [Recharts](https://recharts.org/) (gráficos)
- [date-fns](https://date-fns.org/) / [react-day-picker](https://react-day-picker.js.org/) (datas e calendário)
- [Lucide React](https://lucide.dev/) (ícones)
- [Sonner](https://sonner.emilkowal.ski/) (notificações toast)

**Backend / Infraestrutura**
- [Supabase](https://supabase.com/) — Auth, banco de dados Postgres e Row Level Security (RLS)
- [Vercel Analytics](https://vercel.com/analytics)

**Ferramentas**
- ESLint
- pnpm / npm

---

## 📁 Estrutura do projeto

```
Woofy-projetoFinal/
└── sistema-para-clinica-main/
    ├── app/
    │   ├── (dashboard)/          # Área logada (protegida por middleware)
    │   │   ├── agenda/
    │   │   ├── consultas/
    │   │   ├── dashboard/
    │   │   ├── financeiro/
    │   │   ├── historico/
    │   │   ├── pets/
    │   │   ├── vacinacao/
    │   │   └── layout.tsx
    │   ├── (marketing)/          # Landing page pública
    │   │   └── page.tsx
    │   ├── login/
    │   ├── registro/
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/               # Componentes de UI (shadcn/ui + componentes próprios)
    ├── context/
    │   ├── auth-context.tsx      # Contexto de autenticação
    │   └── app-context.tsx       # Contexto de estado da aplicação
    ├── hooks/                    # Hooks customizados (use-toast, use-mobile, etc.)
    ├── lib/
    │   ├── supabase.ts           # Cliente Supabase (browser)
    │   ├── supabase-server.ts    # Cliente Supabase (server components)
    │   ├── mock-data.ts          # Dados mockados para desenvolvimento/demonstração
    │   └── utils.ts
    ├── supabase/
    │   └── schema.sql            # Script completo de criação do banco (tabelas + RLS)
    ├── middleware.ts             # Proteção de rotas autenticadas
    └── package.json
```

---

## 🗄 Modelo de dados

O schema (`supabase/schema.sql`) cria as seguintes tabelas no Postgres, todas com **Row Level Security** habilitada e políticas por usuário:

| Tabela          | Descrição                                                                 |
|-----------------|----------------------------------------------------------------------------|
| `profiles`      | Estende `auth.users` com dados do perfil da clínica/usuário               |
| `pets`          | Cadastro de pets (nome, espécie, raça, tutor, peso, etc.)                 |
| `consultas`     | Consultas agendadas, com status e veterinário responsável                 |
| `vacinas`       | Vacinas aplicadas e data da próxima dose                                  |
| `historico`     | Linha do tempo de eventos do pet (consulta, vacina, exame)                |
| `lancamentos`   | Lançamentos financeiros (entrada/saída) por categoria                     |
| `agendamentos`  | Horários da agenda da clínica                                             |

Todas as tabelas possuem `created_at`/`updated_at`, chaves estrangeiras indexadas e políticas de RLS que garantem que cada usuário só acesse os próprios registros (`auth.uid() = user_id`).

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [pnpm](https://pnpm.io/) (recomendado, já que o projeto inclui `pnpm-lock.yaml`) ou `npm`/`yarn`
- Uma conta e projeto no [Supabase](https://supabase.com/)

---

## 🚀 Como rodar o projeto localmente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/heloisabolognesi/Woofy-projetoFinal.git
   cd Woofy-projetoFinal/sistema-para-clinica-main
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure o Supabase**

   - Crie um projeto em [supabase.com](https://supabase.com/).
   - No SQL Editor do Supabase, execute o script `supabase/schema.sql` para criar as tabelas, índices, triggers e políticas de RLS.
   - Copie a **Project URL** e a **anon/public key** do seu projeto (em *Project Settings → API*).

4. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz de `sistema-para-clinica-main` (veja a seção [Variáveis de ambiente](#-variáveis-de-ambiente)).

5. **Rode o servidor de desenvolvimento**

   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

6. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env.local` dentro de `sistema-para-clinica-main/` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

> ⚠️ Nunca faça commit do arquivo `.env.local` — ele já deve estar listado no `.gitignore`.

---

## 📜 Scripts disponíveis

Dentro de `sistema-para-clinica-main`:

| Script          | Descrição                                  |
|-----------------|----------------------------------------------|
| `pnpm dev`      | Inicia o servidor de desenvolvimento         |
| `pnpm build`    | Gera o build de produção                     |
| `pnpm start`    | Inicia o servidor com o build de produção    |
| `pnpm lint`     | Executa o ESLint no projeto                  |

---

## 🔐 Autenticação e segurança

- A autenticação é feita via **Supabase Auth** (e-mail/senha), com um contexto (`context/auth-context.tsx`) responsável por expor o usuário logado para toda a aplicação.
- Um **middleware** (`middleware.ts`) protege as rotas do dashboard (`/dashboard`, `/pets`, `/consultas`, `/vacinacao`, `/historico`, `/financeiro`, `/agenda`), redirecionando usuários não autenticados para `/login`, e usuários já autenticados que tentam acessar `/login` ou `/registro` de volta para o dashboard.
- No banco de dados, todas as tabelas possuem **Row Level Security (RLS)** habilitada, garantindo isolamento de dados entre usuários/clínicas diretamente no Postgres.

---

## ☁️ Deploy

O projeto é compatível com deploy na [Vercel](https://vercel.com/), bastando:

1. Importar o repositório na Vercel.
2. Definir o *root directory* como `sistema-para-clinica-main`.
3. Configurar as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no painel do projeto.
4. Fazer o deploy — cada push na branch principal gera um novo deploy automático.

---

## 🗺 Roadmap

Ideias de evolução para o projeto:

- [ ] Upload de imagens dos pets direto para o Supabase Storage
- [ ] Notificações/lembretes automáticos de vacinas e consultas
- [ ] Relatórios financeiros exportáveis (PDF/Excel)
- [ ] Múltiplos perfis de acesso (recepção, veterinário, administrador)
- [ ] Testes automatizados (unitários e end-to-end)

---


## 📄 Licença

Este projeto ainda não possui uma licença definida. Caso deseje torná-lo open source formalmente, considere adicionar um arquivo `LICENSE` (por exemplo, [MIT](https://choosealicense.com/licenses/mit/)).

---

## 📬 Contato

Desenvolvido por **Heloísa Bolognesi**
GitHub: [@heloisabolognesi](https://github.com/heloisabolognesi)

---

<p align="center">Feito com 🐾 e muito café.</p>
