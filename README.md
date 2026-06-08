# Sistema de Gestão para Clínicas Veterinárias

---

## 📋 Índice

1. Explicação do Sistema
2. Estrutura das Pastas
3. Banco de Dados (Entidades e Modelos)
4. Rotas e Páginas (APIs Internas)
5. Tecnologias e Frameworks
6. **Inteligências Artificiais Utilizadas**
7. Passo a Passo de Instalação

---

## 1. 💡 Explicação do Sistema

O **Woofy** é uma plataforma web de gestão inteligente voltada para **clínicas veterinárias**. O sistema foi desenvolvido como projeto final do curso no SENAI e oferece uma interface moderna e responsiva para administrar todos os aspectos operacionais de um negócio pet.

### Objetivo

- Centralizar o gerenciamento de uma clínica veterinária em uma única plataforma: desde o cadastro de animais e seus tutores até o controle financeiro, passando por agendamentos, consultas e vacinação.
    
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

- 2. Estrutura das Pastas
    
    O projeto principal está dentro da pasta `sistema-para-clinica-main/`.
    
    ```
    Woofy-projetoFinal/
    ├── README.md
    └── sistema-para-clinica-main/
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

- O sistema utiliza o Supabase para o gerenciamento de autenticação e proteção de rotas. Já os dados do painel (como consultas e pets) são estáticos, definidos em `lib/mock-data.ts` e carregados no estado global via React Context.
    
    ### Entidade: Pet
    
    | Campo | Tipo | Descrição |
    | --- | --- | --- |
    | `id` | `string` | Identificador único |
    | `nome` | `string` | Nome do animal |
    | `especie` | `"cao" \ | "gato" \ |
    | `raca` | `string` | Raça |
    | `dataNascimento` | `string` | Data de nascimento (ISO) |
    | `peso` | `number` | Peso em kg |
    | `tutor` | `string` | Nome do tutor/responsável |
    | `telefoneTutor` | `string` | Telefone do tutor |
    | `foto?` | `string` | URL da foto (opcional) |
    | `arquivado?` | `boolean` | Soft delete (opcional) |
    
    ### Entidade: Consulta
    
    | Campo | Tipo | Descrição |  |  |
    | --- | --- | --- | --- | --- |
    | `id` | `string` | Identificador único |  |  |
    | `petId` | `string` | Referência ao Pet |  |  |
    | `petNome` | `string` | Nome do pet (desnormalizado) |  |  |
    | `tutor` | `string` | Nome do tutor |  |  |
    | `data` | `string` | Data da consulta (ISO) |  |  |
    | `horario` | `string` | Horário (HH:MM) |  |  |
    | `veterinario` | `string` | Nome do veterinário |  |  |
    | `motivo` | `string` | Motivo da consulta |  |  |
    | `status` | `"agendada" \ | "realizada" \ | "cancelada"` | Status atual |
    
    ### Entidade: Vacina
    
    | Campo | Tipo | Descrição |
    | --- | --- | --- |
    | `id` | `string` | Identificador único |
    | `petId` | `string` | Referência ao Pet |
    | `petNome` | `string` | Nome do pet (desnormalizado) |
    | `vacina` | `string` | Nome da vacina |
    | `dataAplicacao` | `string` | Data de aplicação (ISO) |
    | `proximaDose` | `string` | Data da próxima dose (ISO) |
    
    ### Entidade: HistoricoItem
    
    | Campo | Tipo | Descrição |
    | --- | --- | --- |
    | `id` | `string` | Identificador único |
    | `petId` | `string` | Referência ao Pet |
    | `data` | `string` | Data do registro (ISO) |
    | `tipo` | `"consulta" \ | "vacina" \ |
    | `descricao` | `string` | Descrição do atendimento |
    | `veterinario` | `string` | Veterinário responsável |
    
    ### Entidade: Lancamento (Financeiro)
    
    | Campo | Tipo | Descrição |
    | --- | --- | --- |
    | `id` | `string` | Identificador único |
    | `descricao` | `string` | Descrição do lançamento |
    | `tipo` | `"entrada" \ | "saida"` |
    | `valor` | `number` | Valor em R$ |
    | `data` | `string` | Data do lançamento (ISO) |
    | `categoria` | `string` | Categoria (Consultas, Vacinas, etc.) |
    
    ### Entidade: Agendamento
    
    | Campo | Tipo | Descrição |
    | --- | --- | --- |
    | `id` | `string` | Identificador único |
    | `petId` | `string` | Referência ao Pet |
    | `petNome` | `string` | Nome do pet (desnormalizado) |
    | `tutor` | `string` | Nome do tutor |
    | `data` | `string` | Data do agendamento (ISO) |
    | `horarioInicio` | `string` | Hora de início (HH:MM) |
    | `horarioFim` | `string` | Hora de fim (HH:MM) |
    | `veterinario` | `string` | Veterinário responsável |
    | `tipo` | `string` | Tipo (Consulta, Vacinação, Cirurgia…) |
    
    ### Estado Global (AppContext)
    
    Todas as entidades são controladas pelo `AppContext` e expostas via hook `useApp()`. Cada entidade possui seu próprio `useState` e setter, permitindo que qualquer página leia ou modifique o estado globalmente durante a sessão.
    
    ```tsx
    // Uso em qualquer componente:
    const { pets, setPets, consultas, addToast } = useApp()
    ```
    

---

## 4. 🗺️ Rotas e Páginas

- O sistema usa o **App Router do Next.js 16** com grupos de rotas para separar o contexto público (marketing) do sistema interno (dashboar
    
    ### Grupo (marketing) — Público
    
    | Rota | Arquivo | Descrição |
    | --- | --- | --- |
    | `/` | `app/(marketing)/page.tsx` | Landing page institucional completa |
    
    ### Grupo (dashboard) — Sistema Interno
    
    | Rota | Arquivo | Descrição |
    | --- | --- | --- |
    | `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Painel com métricas e gráficos |
    | `/pets` | `app/(dashboard)/pets/page.tsx` | Listagem, criação, edição e arquivamento de pets |
    | `/consultas` | `app/(dashboard)/consultas/page.tsx` | Gerenciamento de consultas |
    | `/vacinacao` | `app/(dashboard)/vacinacao/page.tsx` | Registro e controle de vacinas |
    | `/historico` | `app/(dashboard)/historico/page.tsx` | Histórico clínico por pet |
    | `/financeiro` | `app/(dashboard)/financeiro/page.tsx` | Lançamentos e balanço financeiro |
    | `/agenda` | `app/(dashboard)/agenda/page.tsx` | Calendário de agendamentos |
    
    ⚠️ **Nota:** O sistema não possui uma API REST externa. Todas as operações (create, read, update, delete) são realizadas diretamente no estado React via `AppContext`. Não há chamadas HTTP entre páginas.
    
    ### Navegação
    
    A Sidebar (`components/sidebar.tsx`) é responsável pela navegação interna. Em dispositivos móveis, ela é exibida como menu hambúrguer. Em desktops, é fixa na lateral esquerda com largura de 64px (256px).
    

---

## 5. 🛠️ Tecnologias e Frameworks

- O projeto Woofy foi construído utilizando uma **stack moderna e escalável**, focada em performance, acessibilidade e experiência do desenvolvedor. Abaixo estão detalhadas as tecnologias que compõem o ecossistema do sistema.
    
    **🚀 Core (Base do Sistema)**
    
    | **Tecnologia** | **Versão** | **Uso Principal** |
    | --- | --- | --- |
    | **Next.js** | 16.2.6 | Framework Fullstack com App Router, SSR e otimização de performance. |
    | **React** | 19.0 | Biblioteca base para construção de interfaces reativas e componentes. |
    | **TypeScript** | 5.7.3 | Desenvolvimento com tipagem estática, garantindo maior segurança e menos bugs. |
    
    **🎨 Design & Estilização (UI/UX)**
    
    | **Tecnologia** | **Versão** | **Uso Principal** |
    | --- | --- | --- |
    | **Tailwind CSS** | 4.2.0 | Framework CSS utilitário para estilização rápida e responsiva. |
    | **shadcn/ui** | — | Coleção de componentes reutilizáveis e acessíveis integrados ao Tailwind. |
    | **Radix UI** | Múltiplas | Primitivos de UI para garantir acessibilidade (WAI-ARIA) em diálogos e menus. |
    | **Lucide React** | 0.564.0 | Conjunto de ícones vetoriais modernos e leves. |
    | **Next Themes** | 0.4.6 | Gerenciamento inteligente de temas (Light/Dark Mode). |
    
    **📝 Gerenciamento de Dados & Formulários**
    
    | **Tecnologia** | **Versão** | **Uso Principal** |
    | --- | --- | --- |
    | **React Hook Form** | 7.54.1 | Gerenciamento eficiente de formulários sem re-renderizações desnecessárias. |
    | **Zod** | 3.24.1 | Validação de schemas e dados em tempo de execução. |
    | **Date-fns** | 4.1.0 | Biblioteca para manipulação e formatação de datas de forma simplificada. |
    
    **📊 Visualização & Experiência do Usuário**
    
    | **Tecnologia** | **Versão** | **Uso Principal** |
    | --- | --- | --- |
    | **Recharts** | 2.15.0 | Gráficos interativos para visualização de métricas no Dashboard. |
    | **Sonner** | 1.7.1 | Sistema de notificações (toasts) elegante e não intrusivo. |
    | **Embla Carousel** | 8.6.0 | Biblioteca de carrossel fluida para a Landing Page e Galeria. |
    | **Vaul** | 1.1.2 | Drawer (gavetas) mobile para melhor navegação em telas pequenas. |
    
    **🔡 Identidade Visual (Tipografia)**
    
    - **DM Sans:** Utilizada para o corpo de texto e interface de usuário, focando na legibilidade.
    - **Fraunces:** Utilizada em títulos e headings para trazer um ar sofisticado e acolhedor.
    
    **🌐 Deploy & Infraestrutura**
    
    - **Vercel:** Plataforma de hospedagem oficial com integração contínua (CI/CD).
    

---

## **6. 🦾 Inteligências Artificiais Utilizadas**

- O desenvolvimento do **Woofy** foi potencializado pelo uso estratégico de diversas Inteligências Artificiais, cada uma desempenhando um papel crucial em diferentes etapas do ciclo de vida do projeto:
    
    
    **🏗️ Estruturação e Planejamento (ChatGPT & Claude)**
    
    Estas ferramentas foram a base para o início do projeto, sendo utilizadas para:
    
    - **Arquitetura e Código:** Definição da estrutura de pastas, escolha da arquitetura do sistema e escrita dos primeiros blocos de código em TypeScript e Next.js.
    - **Identidade Visual:** Auxílio na definição da paleta de cores, escolha da tipografia (como a DM Sans e Fraunces) e conceitos visuais que transmitem confiança e modernidade para a clínica.
    
    **🎨 Desenvolvimento Frontend (v0.dev & Manus AI)**
    
    Para a interface que o usuário final interage, as IAs foram fundamentais na agilidade e design:
    
    - **v0.dev:** Utilizada para gerar os componentes iniciais da interface baseados em Tailwind CSS e shadcn/ui, permitindo uma prototipagem rápida e funcional.
    - **Manus AI:** Atuou no desenvolvimento prático do frontend, ajudando a construir a estrutura da **Home Page** e garantindo a responsividade e coesão visual entre a Landing Page e o Dashboard.
    
    **🔗 Integração e Dados (Antigravyti)**
    
    - **Antigravyti:** Desempenhou um papel central na organização e lógica de integração dos dados. Foi utilizada para auxiliar na estruturação das entidades do sistema e na lógica de como as informações (pets, consultas, financeiro) se conectam dentro do estado global do projeto.

---

## 7. 🚀 Passo a Passo de Instalação

- Siga as instruções abaixo para configurar o ambiente de desenvolvimento e executar o **Woofy** localmente em sua máquina.
    
    ### **📋 Pré-requisitos**
    
    Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:
    
    - **Node.js (v18.0.0 ou superior):** Baixar Node.js
    - **Git:** Baixar Git
    - **Gerenciador de Pacotes:** Recomendamos o **pnpm** para melhor performance, mas você também pode usar `npm` ou `yarn`.

---

- **🛠️ Guia de Configuração**
    
    Abra o terminal e execute os comandos abaixo para baixar o projeto:
    
    ### Passo 1 — Clonar o Repositório
    
    ```bash
    git clone https://github.com/heloisabolognesi/Woofy-projetoFinal.git
    cd Woofy-projetoFinal
    ```
    
    ---
    
    ### Passo 2 —  Acessar a Branch Principal
    
    O código principal está na branch `main`:
    
    ```bash
    git checkout main
    ```
    
    Você verá a pasta `v0-sistema-para-clinica-main/` no diretório.
    
    ---
    
    ### Passo 3 — Entrar na Pasta do Projeto
    
    ```bash
    cd v0-sistema-para-clinica-main
    ```
    
    ---
    
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
    
    ---
    
    ### Passo 5 — Iniciar o **Servidor de** Desenvolvimento
    
    ```bash
    npm run dev
    # ou
    pnpm dev
    ```
    
    Abra o navegador em **http://localhost:3000**.
    
    Você verá a **Landing Page**. Para acessar o sistema interno, acesse **http://localhost:3000/dashboard**.
    
    ---
    
    ### **📦**  Build para Produção (opcional)
    
    ```bash
    npm run build
    npm run start
    ```
    
    ### **📜** Scripts Disponíveis
    
    | Comando | Descrição |
    | --- | --- |
    | `dev` | Inicia o servidor com Hot Reload (atualização em tempo real). |
    | `build` | Compila o projeto e gera os arquivos para produção. |
    | `start` | Executa o servidor de produção após o build. |
    | `lint` | Analisa o código em busca de erros de padrão e boas práticas. |
    
    ---
    
    ### **⚠️ Solução de Problemas Comuns**
    
    - **Versão do Node:** Se encontrar erros estranhos na instalação, verifique se está usando o Node 18+ com `node -v`.
    - **Porta 3000 Ocupada:** Se o terminal avisar que a porta 3000 já está em uso, o Next.js tentará abrir na porta 3001. Fique atento à mensagem no terminal.
    - **Cache do Next.js:** Se as mudanças não aparecerem, tente apagar a pasta `.next` e rodar o comando `dev` novamente.

---

## 🌿 Branches do Repositório

| Branch | Descrição |
| --- | --- |
| `main` | Branch principal (README apenas) |
| `Heloisa-Bolognesi` | Frontend |
| `Guilherme-Lima` | Backend |

---
