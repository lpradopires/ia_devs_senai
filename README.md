# ia_devs_senai
Curso de IA para Devs Senai - SC
# 🏔️ Catarina Empreende

> Plataforma web para gerenciamento de empreendimentos catarinenses, desenvolvida como projeto do Curso de IA para Devs — SENAI-SC.

---

## 📋 Índice de Navegação

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Deploy da Aplicação](#deploy-da-aplicação)
- [Vídeo Pitch](#vídeo-pitch)
- [Decisões Técnicas e Boas Práticas](#decisões-técnicas-e-boas-práticas)
- [Estratégia de Versionamento (Git)](#estratégia-de-versionamento-git)
- [Melhorias Futuras](#melhorias-futuras)
- [Referências](#referências)
- [Autor](#autor)

---

## 🚀 Sobre o Projeto

**Catarina Empreende** é uma aplicação web Single Page Application (SPA) criada para catalogar, visualizar e gerenciar empreendimentos do estado de Santa Catarina. A plataforma permite que gestores e administradores realizem operações completas de CRUD (Create, Read, Update, Delete) sobre um cadastro de empreendimentos, com persistência em tempo real via Firebase Realtime Database.

A aplicação conta com uma interface moderna e responsiva, suporte a **modo escuro**, busca global com filtro instantâneo, ordenação por colunas, visualização de imagens por empreendimento e integração com o **Google Maps** para localização geográfica.

---

## ✨ Funcionalidades

### Gerenciamento de Empreendimentos

| Operação | Descrição |
|----------|-----------|
| **Criar** | Cadastro de novos empreendimentos via formulário validado com Reactive Forms |
| **Listar** | Tabela paginada e rolável exibindo todos os registros em tempo real |
| **Editar** | Atualização de dados via formulário (modo edição) com carregamento automático dos campos |
| **Excluir** | Remoção com confirmação via dialog de alerta antes da exclusão definitiva |

### Campos Gerenciados

- **Nome do Empreendimento** — identificação principal do negócio
- **Nome do(a) Empreendedor(a) Responsável** — gestão de responsabilidade
- **Descrição** — resumo das atividades e propósito do empreendimento
- **Município** — cidade de Santa Catarina onde está localizado
- **Segmento de Atuação** — `Tecnologia`, `Comércio`, `Indústria`, `Serviços`, `Serviço Público` ou `Agronegócio`
- **E-mail de Contato** — validação de formato opcional
- **WhatsApp** — máscara `(99) 99999-9999` para contato rápido
- **Status** — `Ativo` ou `Inativo`, exibido com tag colorida
- **Endereço** — logradouro, bairro e CEP
- **Localização** — abertura direta no Google Maps pelo endereço cadastrado
- **Imagens** — galeria de fotos associadas ao empreendimento
- **Data de Cadastro** — gerada automaticamente e exibida na tabela

### Recursos Adicionais

- 🔍 **Busca Global** — filtra instantaneamente por nome, município, segmento, e-mail, status, endereço e outros campos
- ↕️ **Ordenação de Colunas** — clique no cabeçalho de qualquer coluna para ordenar
- 🌙 **Modo Escuro / Claro** — alternância via botão na barra de navegação
- 📸 **Galeria de Imagens** — visualizador de fotos por empreendimento com zoom
- 📍 **Integração com Google Maps** — abre a localização no Maps em nova aba
- ⚡ **Dados em Tempo Real** — a lista se atualiza automaticamente sem recarregar a página (Firebase onValue listener)
- 📊 **Paginação** — 10 registros por página com barra de paginação fixa

---

## 🛠️ Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Angular** | `^20.2.0` | Framework principal (SPA, componentes standalone, zoneless) |
| **TypeScript** | `~5.9.2` | Tipagem estática e interfaces do domínio |
| **HTML5** | — | Estrutura semântica dos templates |
| **SCSS** | — | Estilos globais e por componente |

### UI Components

| Biblioteca | Versão | Finalidade |
|------------|--------|------------|
| **PrimeNG** | `^20.4.0` | Componentes de UI (Table, Dialog, Button, Select, Tag, InputMask, etc.) |
| **PrimeIcons** | `^7.0.0` | Biblioteca de ícones vetoriais |
| **@primeuix/themes** | `^2.0.3` | Sistema de temas (preset Aura com modo escuro) |
| **Angular CDK** | `^20.2.14` | Primitivas de acessibilidade e interação |

### Backend / Banco de Dados / Hospedagem

| Serviço | Função |
|---------|--------|
| **Firebase Realtime Database** | Persistência de dados em tempo real (NoSQL) |
| **Firebase Hosting** | Hospedagem estática da aplicação compilada |
| **@angular/fire** | `^20.0.1` — SDK oficial Angular para Firebase |
| **firebase** | `^11.10.0` — SDK base do Firebase |

### Versionamento

| Ferramenta | Uso |
|------------|-----|
| **Git** | Controle de versão local e rastreamento de mudanças |
| **GitHub** | Repositório remoto, colaboração e histórico público |

---

## 📁 Estrutura do Projeto

```
catarina-empreende/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── firebase/
│   │   │       └── realtime-db.service.ts   # Serviço genérico de acesso ao Realtime DB (CRUD base)
│   │   ├── features/
│   │   │   └── empreendimentos/
│   │   │       ├── model/
│   │   │       │   └── empreendimento.model.ts  # Interfaces e types do domínio
│   │   │       ├── pages/
│   │   │       │   ├── lista-empreendimento/
│   │   │       │   │   └── lista-empreendimento.ts  # Página principal com tabela CRUD
│   │   │       │   └── formulario-empreendimento/
│   │   │       │       └── formulario-empreendimento.ts  # Formulário de criação/edição
│   │   │       └── services/
│   │   │           └── empreendimento.service.ts  # Serviço de domínio (CRUD + listener RT)
│   │   ├── shared/               # (reservado para componentes/pipes reutilizáveis)
│   │   ├── app.config.ts         # Configuração global: providers, Firebase, PrimeNG, Router
│   │   ├── app.routes.ts         # Definição de rotas da aplicação
│   │   └── app.ts                # Componente raiz: navbar, dark mode, router-outlet
│   ├── environments/
│   │   └── environment.ts        # Credenciais do Firebase (não commitado)
│   ├── assets/
│   │   └── bandeira-sc.png       # Ícone da aplicação
│   ├── styles.scss               # Estilos globais
│   ├── main.ts                   # Bootstrap da aplicação Angular
│   └── index.html                # HTML raiz da SPA
├── angular.json                  # Configuração do Angular CLI e build
├── package.json                  # Dependências e scripts npm
├── tsconfig.json                 # Configuração TypeScript
└── .gitignore                    # Arquivos ignorados pelo Git
```

### Descrição das Camadas

- **`core/`** — serviços de infraestrutura compartilhados por toda a aplicação (ex: acesso genérico ao Firebase).
- **`features/`** — módulos de domínio organizados por funcionalidade. Cada feature contém seu `model`, `pages` e `services`.
- **`shared/`** — componentes, pipes e diretivas reutilizáveis entre múltiplas features.
- **`environments/`** — configurações por ambiente (desenvolvimento e produção), contendo as credenciais do Firebase.

---

## 📦 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter o seguinte configurado:

### Node.js

- **Node.js** `>= 18.x` — [Download aqui](https://nodejs.org/)
- **npm** `>= 9.x` (já vem instalado com o Node) ou **yarn**
- **Angular CLI** `^20.x`

Para verificar as versões instaladas:
```bash
node -v
npm -v
```

Para instalar o Angular CLI globalmente:
```bash
npm install -g @angular/cli@latest
```

### Projeto no Firebase

A aplicação utiliza o **Firebase Realtime Database** e o **Firebase Hosting**. Você precisará de um projeto Firebase próprio para rodar localmente:

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em **Adicionar projeto**.
2. Dê um nome ao projeto (ex: `catarina-empreende-dev`) e conclua o assistente.
3. No painel do projeto, vá em **Build → Realtime Database** e clique em **Criar banco de dados**.
   - Escolha a região mais próxima (ex: `us-central1`).
   - Selecione o modo **Teste** para desenvolvimento local.
4. Em **Visão geral do projeto**, clique em **Adicionar app → Web** (`</>`), registre o app e copie o objeto `firebaseConfig`.
5. Opcionalmente, ative o **Firebase Hosting** (Build → Hosting) para fazer deploy mais tarde.

> ⚠️ As credenciais do Firebase devem ser inseridas no arquivo `src/environments/environment.ts` (veja o passo 3 em **Como Rodar Localmente**).

---

## ⚙️ Como Rodar Localmente

### Passo a Passo

#### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/ia_devs_senai.git
cd ia_devs_senai/catarina-empreende
```

#### 2. Instalar as dependências

```bash
npm install
# ou
yarn install
```

#### 3. Configurar o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um novo projeto.
2. Ative o **Realtime Database** (modo de teste para desenvolvimento) e o **Firebase Hosting**.
3. Registre um aplicativo Web no seu projeto Firebase e copie o objeto de configuração.
4. Edite (ou crie) o arquivo `src/environments/environment.ts` com suas credenciais:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
  }
};
```

> ⚠️ **Atenção:** Nunca commite o arquivo `environment.ts` com credenciais reais. Ele já está listado no `.gitignore`.

#### 4. Rodar a aplicação em desenvolvimento

```bash
ng serve
```

#### 5. Acessar no navegador

Abra [http://localhost:4200](http://localhost:4200) no seu navegador.

> Na primeira execução, a aplicação irá popular automaticamente o banco com **20 empreendimentos reais** de municípios catarinenses para demonstração.

---

## 🌐 Deploy da Aplicação

A aplicação está publicada e disponível no Firebase Hosting:

**🔗 [https://catarina-empreende.web.app](https://catarina-empreende.web.app)** *(atualizar com o link real após o deploy)*

Para realizar o deploy manualmente:

```bash
# Build de produção
ng build --configuration production

# Deploy no Firebase Hosting (requer firebase-tools instalado)
npm install -g firebase-tools
firebase login
firebase deploy
```

---

## 🎬 Vídeo Pitch

**🔗 [Assistir no YouTube](#)** *(link a ser inserido após a gravação)*

O vídeo apresenta:
- **Contextualização do problema** — necessidade de centralizar informações sobre empreendimentos catarinenses
- **Demonstração das funcionalidades** — criação, listagem, edição, exclusão, busca e filtros
- **Arquitetura técnica** — decisões sobre Angular, PrimeNG e Firebase
- **Diferenciais do projeto** — dados em tempo real, modo escuro, integração com Maps e galeria de imagens
- **Próximos passos** — melhorias planejadas para versões futuras

---

## 🏗️ Decisões Técnicas e Boas Práticas

### Por que Angular 20?

Angular foi escolhido por ser um framework robusto e opinativo, com:
- **Componentes Standalone** — eliminação de NgModules, simplificando a estrutura e o treeshaking
- **Zoneless Change Detection** (`provideZonelessChangeDetection()`) — detecção de mudanças mais eficiente, sem dependência do Zone.js
- **Signals** — reatividade granular e performática, substituindo a necessidade de `BehaviorSubject` em muitos casos
- **Reactive Forms** — validação declarativa e tipada dos formulários de cadastro

### Por que PrimeNG 20?

PrimeNG oferece um ecossistema rico de componentes prontos para produção:
- `p-table` com paginação, ordenação, filtro global e scroll customizável
- `p-dialog` para formulários modais de criação/edição
- `p-confirmdialog` para confirmação de exclusão
- `p-inputmask` para formatação de CEP e WhatsApp
- Sistema de temas com suporte nativo a **modo escuro** via classe CSS

### Por que Firebase Realtime Database?

- **Sincronização em tempo real** — listeners `onValue` notificam todos os clientes conectados sem necessidade de polling
- **Backend-as-a-Service** — sem necessidade de manter servidor ou API própria
- **Hosting integrado** — deploy de projetos Angular com CDN global em poucos minutos
- **Escalabilidade automática** — ideal para protótipos e MVPs

### Arquitetura Adotada

```
Componente (View)
    ↕ Input/Output
Componente Filho (FormularioEmpreendimento)
    ↕ inject()
Serviço de Domínio (EmpreendimentoService)
    ↕ inject()
Serviço de Infraestrutura (RealtimeDbService)
    ↕ SDK
Firebase Realtime Database
```

- **Separação de responsabilidades**: a View não acessa o Firebase diretamente; toda a lógica de persistência é encapsulada em serviços.
- **Serviço genérico de CRUD** (`RealtimeDbService`) — operações base reutilizáveis.
- **Serviço de domínio** (`EmpreendimentoService`) — lógica específica de empreendimentos, incluindo o listener de tempo real.
- **Comunicação entre componentes** via `@Input()` / `@Output()` — o componente pai controla a visibilidade do dialog e recebe eventos do formulário.

### Boas Práticas de Código

- **Nomenclatura em português** — variáveis, métodos e propriedades seguem a língua do negócio (ex: `nomeEmpreendimento`, `obterSeveridade`, `alternarModoEscuro`)
- **Comentários JSDoc** — todos os métodos e propriedades relevantes documentados com `/** */`
- **Typed Signals** — uso de `signal<boolean>`, `toSignal()` com valor inicial tipado
- **Async/Await** — operações assíncronas claras e legíveis
- **Validator customizado** — `validarEmailOpcional()` para campos de e-mail opcionais (não rejeita string vazia)
- **Cleanup automático de listeners** — `toSignal()` cancela o `onValue` do Firebase quando o componente é destruído

---

## 🌿 Estratégia de Versionamento (Git)

### Modelo de Branches (Git Flow Simplificado)

```
main
  └── develop
        ├── feature/cadastro-empreendimento
        ├── feature/listagem-tabela
        ├── feature/formulario-edicao
        └── ...
```

| Branch | Finalidade |
|--------|-----------|
| `main` | Código de **produção estável**. Recebe merges apenas de `release/*` e `hotfix/*` |
| `develop` | Código de **desenvolvimento contínuo**. Todas as features são integradas aqui |
| `feature/<nome>` | Desenvolvimento de novas funcionalidades, criada a partir de `develop` |
| `release/<versão>` | Preparação para deploy em produção (testes finais, ajustes) |
| `hotfix/<nome>` | Correção urgente de bugs em produção, criada a partir de `main` |

### Fluxo de Trabalho

```
1. Nova funcionalidade:
   git checkout develop
   git checkout -b feature/minha-feature
   # ... commits ...
   git checkout develop
   git merge feature/minha-feature

2. Preparação para release:
   git checkout develop
   git checkout -b release/1.0.0
   # testes + ajustes finais
   git checkout main
   git merge release/1.0.0
   git tag v1.0.0
   git checkout develop
   git merge release/1.0.0

3. Hotfix:
   git checkout main
   git checkout -b hotfix/corrige-bug-critico
   # correção
   git checkout main && git merge hotfix/...
   git tag v1.0.1
   git checkout develop && git merge hotfix/...
```

### Convenção de Commits (Commits Semânticos)

Formato:
```
<tipo>(<escopo>): <descrição curta>

[corpo opcional]

[rodapé opcional]
```

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Alterações na documentação |
| `style` | Formatação, espaçamento (sem mudança de lógica) |
| `refactor` | Reescrita sem adicionar feature ou corrigir bug |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de manutenção (deps, build, CI) |

**Exemplos:**

```
feat(empreendimento): adiciona cadastro de novo empreendimento com Reactive Forms
fix(ui): corrige ordenação da tabela ao recarregar a página
docs(readme): adiciona seção de estratégia de versionamento
chore(deps): atualiza Angular para versão 20.2.x
refactor(service): extrai lógica de seed para método privado popularBancoDeDados
style(formulario): padroniza espaçamento dos campos com variáveis CSS
```

---

## 🔮 Melhorias Futuras

- [ ] **Autenticação com Firebase Auth** — login com Google para controle de acesso
- [ ] **Upload de imagens** — integração com Firebase Storage para upload de fotos reais
- [ ] **Filtros avançados** — filtro por segmento, município e status em painéis laterais
- [ ] **Dashboard com métricas** — gráficos de quantidade por segmento e município (Chart.js ou PrimeNG Charts)
- [ ] **Mapa interativo** — visualizar todos os empreendimentos em um mapa com marcadores (Leaflet ou Google Maps API)
- [ ] **PWA** — suporte offline com Service Workers
- [ ] **Exportação de dados** — download da lista em formato CSV ou PDF
- [ ] **Testes unitários e de integração** — cobertura com Karma/Jasmine e Cypress para E2E
- [ ] **Internacionalização (i18n)** — suporte a múltiplos idiomas

---

## 🔗 Referências

| Tecnologia | Documentação Oficial |
|------------|----------------------|
| **Angular v20** | [v20.angular.dev/overview](https://v20.angular.dev/overview) |
| **PrimeNG v20** | [v20.primeng.org/installation](https://v20.primeng.org/installation) |
| **Node.js** | [nodejs.org](https://nodejs.org/en/) |
| **Firebase** | [firebase.google.com](https://firebase.google.com/?hl=pt-br) |

---

## 👤 Autor

**Leandro Prado Pires**

[![GitHub](https://github.com/lpradopires)
[![LinkedIn](https://www.linkedin.com/in/leandro-prado-pires-212565142/)

---

<div align="center">
  <sub>Desenvolvido com ❤️ para o Curso de IA para Devs — SENAI-SC · 2025</sub>
</div>
