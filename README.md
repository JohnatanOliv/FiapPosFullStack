Aluno: rm369240_JohnatanSantos 


# BlogSchool - Plataforma Full Stack

Este repositório reúne uma solução completa para um sistema de blog escolar com uma API backend, uma interface web e um aplicativo mobile. A proposta é oferecer um ambiente para publicação, leitura, comentários e gestão de usuários com diferentes papéis, como professores e alunos.

## Visão Geral

O projeto foi estruturado em três partes principais:

- Backend: API REST em Node.js e Express
- Frontend web: aplicação em React com Vite
- Mobile: aplicativo em React Native com Expo

A arquitetura foi pensada para permitir escalabilidade, organização por módulos e integração entre as camadas do sistema.

## Funcionalidades Principais

### Backend
- Autenticação via token para usuários
- Cadastro e login de professores e alunos
- CRUD de posts
- Busca de posts por palavra-chave
- Gestão de usuários com controle por papel
- Endpoints para comentários
- Health check para monitoramento básico

### Frontend Web
- Página inicial com seleção entre aluno e professor
- Login e cadastro para professores
- Dashboard para alunos com visualização de posts
- Dashboard para professores com gestão de conteúdo
- Página pública de posts
- Página de detalhes de post
- Gerenciamento de usuários por área administrativa

### Aplicativo Mobile
- Navegação entre telas de acesso e dashboard
- Fluxo de aluno e professor
- Visualização de posts e detalhes
- Gestão de usuários no mobile
- Design com tema diferenciado para cada tipo de usuário

## Estrutura do Repositório

```text
FiapPosFullStack/
├── blog-api/                # API REST em Node.js
├── blog-frontend/           # Frontend web em React/Vite
├── BlogSchoolMobile/        # Aplicativo mobile em React Native/Expo
├── README.md                # Documentação principal
└── PROJETO_COMPLETO.md      # Documento detalhado do projeto
```

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT customizado via HMAC SHA-256
- bcryptjs
- CORS
- Jest e Supertest

### Frontend
- React 19
- Vite
- React Router
- Axios
- ESLint

### Mobile
- React Native
- Expo
- React Navigation
- Context API

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js 18 ou superior
- npm ou yarn
- MongoDB local ou uma instância remota
- Expo CLI (opcional para execução no mobile)

## Configuração do Backend

1. Acesse a pasta do backend:

```bash
cd blog-api
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo .env com as variáveis abaixo:

```env
PORT=3000
MONGODB_URI_LOCAL=mongodb://localhost:27017/blogschool
MONGODB_URI=mongodb://localhost:27017/blogschool
AUTH_SECRET=blogschool-dev-secret
```

4. Inicie o servidor:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Configuração do Frontend Web

1. Acesse a pasta do frontend:

```bash
cd blog-frontend/frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie a aplicação:

```bash
npm run dev
```

A interface web ficará disponível em:

```text
http://localhost:5173
```

## Configuração do Mobile

1. Acesse a pasta do projeto mobile:

```bash
cd BlogSchoolMobile
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o Expo:

```bash
npm start
```

Você poderá abrir o app em um emulador, dispositivo físico ou navegador web, conforme a opção escolhida no Expo.

## Endpoints Principais da API

### Usuários
- POST /users/register
- POST /users/login
- GET /users
- POST /users
- GET /users/:id
- PUT /users/:id
- DELETE /users/:id

### Posts
- GET /posts
- GET /posts/:id
- GET /posts/search
- POST /posts
- PUT /posts/:id
- DELETE /posts/:id

### Comentários
- GET /posts/:id/comments
- POST /posts/:id/comments
- PUT /posts/:id/comments/:commentId
- DELETE /posts/:id/comments/:commentId

## Fluxos de Uso

### Fluxo de Aluno
- Acessa a área pública ou a tela de aluno
- Visualiza posts publicados
- Consulta detalhes e comentários

### Fluxo de Professor
- Realiza login
- Gerencia posts e conteúdo
- Cria, edita e remove informações
- Administra usuários em áreas específicas

## Boas Práticas e Observações

- O backend utiliza middlewares para autenticação e autorização
- O frontend consome a API por meio de um cliente Axios centralizado
- O mobile usa contexto global para manter o estado do usuário
- A estrutura foi organizada para facilitar manutenção e evolução do projeto

## Próximos Passos Recomendados

- Integrar autenticação mais robusta com refresh token
- Implementar upload de imagens para posts
- Melhorar a camada de testes automatizados
- Adicionar persistência de sessão no mobile
- Expandir o design e a experiência do usuário

## Status do Projeto

O projeto está em fase de evolução e já conta com uma base funcional para backend, frontend web e aplicativo mobile.

## Licença

Este projeto foi desenvolvido como estudo e demonstração de uma arquitetura full stack com foco em aplicação web, API e mobile.


