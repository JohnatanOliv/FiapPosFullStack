# BlogSchool - Documentação Completa do Projeto

## 1. Introdução

O BlogSchool é uma aplicação full stack desenvolvida para simular um sistema de publicação e gestão de conteúdo escolar, com foco em três frentes:

- Backend para persistência e regras de negócio
- Frontend web para navegação e interação do usuário
- Aplicativo mobile para acesso rápido e experiência móvel

A proposta do projeto é oferecer uma plataforma onde professores e alunos possam interagir de forma organizada, com posts, comentários e gestão de contas.

## 2. Objetivo do Sistema

O sistema tem como objetivo central permitir:

- Publicar conteúdo em formato de posts
- Exibir conteúdo para usuários autenticados e visitantes
- Gerenciar usuários com diferentes perfis
- Prover uma experiência completa para web e mobile

## 3. Arquitetura do Projeto

A aplicação está dividida em três módulos independentes, porém integrados:

### 3.1 Backend - API REST
Localização: blog-api

Responsável por:
- Receber e processar requisições HTTP
- Validar dados de entrada
- Aplicar regras de autenticação e autorização
- Persistir informação no banco MongoDB
- Expor endpoints para consumo do frontend e do mobile

### 3.2 Frontend Web
Localização: blog-frontend/frontend

Responsável por:
- Apresentar as páginas da aplicação
- Consumir a API backend
- Gerenciar navegação entre telas e rotas
- Exibir dashboards e páginas públicas

### 3.3 Mobile
Localização: BlogSchoolMobile

Responsável por:
- Reproduzir a experiência do sistema em dispositivos móveis
- Navegar entre telas de login, dashboard e detalhes de post
- Apresentar o conteúdo de forma responsiva para usuários mobile

## 4. Estrutura de Pastas

```text
FiapPosFullStack/
├── blog-api/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   └── tests/
├── blog-frontend/
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── routes/
│       │   └── services
├── BlogSchoolMobile/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── styles
```

## 5. Funcionalidades Implementadas

### 5.1 Backend
- Cadastro de usuários
- Login com retorno de token
- Proteção de rotas com autenticação
- Controle de acesso por papel
- CRUD completo de posts
- Busca de posts por termo
- Gerenciamento de comentários

### 5.2 Frontend Web
- Rotas públicas e privadas
- Página inicial com opção de acesso por perfil
- Login para professores e alunos
- Dashboard de professor
- Dashboard de aluno
- Visualização de detalhes de post
- Navegação entre páginas públicas e privadas

### 5.3 Mobile
- Tela inicial com seleção de perfil
- Login de professor
- Cadastro de professor
- Dashboard de aluno
- Dashboard de professor
- Visualização de detalhes do post
- Navegação entre telas com React Navigation

## 6. Modelo de Dados

### Usuário
Os usuários possuem atributos como:
- nome
- email
- senha hash
- papel (teacher ou student)
- datas de criação e atualização

### Post
Os posts podem conter:
- título
- conteúdo
- autor
- datas de criação e atualização

## 7. Regras de Negócio

Algumas regras aplicadas no backend incluem:
- E-mails devem ser únicos
- Senhas são armazenadas com hash
- Apenas professores podem criar, editar e remover posts
- Usuários devem estar autenticados para acessar rotas protegidas
- A busca por posts aceita palavras-chave simples

## 8. Fluxo de Execução

### 8.1 Subir a API
```bash
cd blog-api
npm install
npm run dev
```

### 8.2 Subir o Frontend Web
```bash
cd blog-frontend/frontend
npm install
npm run dev
```

### 8.3 Subir o Mobile
```bash
cd BlogSchoolMobile
npm install
npm start
```

## 9. Variáveis de Ambiente

O backend utiliza variáveis de ambiente para configuração de porta, banco de dados e segredo de autenticação.

Exemplo:

```env
PORT=3000
MONGODB_URI_LOCAL=mongodb://localhost:27017/blogschool
MONGODB_URI=mongodb://localhost:27017/blogschool
AUTH_SECRET=blogschool-dev-secret
```

No frontend web, a integração com a API pode ser ajustada com a variável:

```env
VITE_API_URL=http://localhost:3000
```

## 10. Endpoints da API

### Usuários
```text
POST /users/register
POST /users/login
GET /users
POST /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

### Posts
```text
GET /posts
GET /posts/:id
GET /posts/search
POST /posts
PUT /posts/:id
DELETE /posts/:id
```

### Comentários
```text
GET /posts/:id/comments
POST /posts/:id/comments
PUT /posts/:id/comments/:commentId
DELETE /posts/:id/comments/:commentId
```

## 11. Considerações de Desenvolvimento

Este projeto representa uma base sólida para:
- estudos de arquitetura full stack
- implementação de APIs REST
- integração entre backend, frontend e mobile
- organização de código por camada
- prática de autenticação e autorização

## 12. Melhorias Futuras

Algumas evoluções recomendadas:
- autenticação com refresh token
- upload de imagens para posts
- paginação e filtros avançados
- testes end-to-end
- persistência de sessão no mobile
- painel administrativo mais completo

## 13. Resumo Executivo

O BlogSchool é um projeto completo para demonstrar a construção de uma aplicação moderna em três camadas: backend, frontend web e mobile. A solução já apresenta uma estrutura funcional com autenticação, gerenciamento de conteúdo, navegação e integração entre os módulos, servindo como base para evolução contínua e aprendizado técnico.
