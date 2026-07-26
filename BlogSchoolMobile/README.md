# BlogSchool Mobile (React Native + Expo)

Um aplicativo móvel para a plataforma BlogSchool, desenvolvido em React Native com Expo. Oferece uma experiência otimizada para alunos lerem posts colaborativos e professores gerenciarem conteúdo.

## 📱 Features

- **Tela Inicial**: Seleção de papel (Aluno/Professor)
- **Dashboard do Aluno**: Visualização de posts, busca e filtros
- **Login do Professor**: Acesso via código de segurança
- **Dashboard do Professor**: Gerenciamento de posts
- **Design System**: Tema escuro com acentuação por papel (azul para alunos, ouro para professores)
- **Responsivo**: Adaptado para diversos tamanhos de tela

## 🛠️ Tecnologia

- **React Native** - Framework para desenvolvimento móvel
- **Expo** - Plataforma para compilação e distribuição
- **@react-navigation** - Sistema de navegação entre telas
- **StyleSheet** - Estilização nativa (sem CSS)

## 📁 Estrutura do Projeto

```
BlogSchoolMobile/
├── App.js                          # Entry point com navegação
├── src/
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── Header.js              # Cabeçalho de seção
│   │   ├── HomeButton.js          # Botão com tema (Student/Teacher)
│   │   └── PostCard.js            # Card de post
│   │
│   ├── context/
│   │   └── UserContext.js         # Gerenciamento de estado do usuário
│   │
│   ├── hooks/
│   │   └── useTheme.js            # Hook para aplicar tema correto
│   │
│   ├── screens/                    # Telas da aplicação
│   │   ├── HomeScreen.js          # Seleção de papel
│   │   ├── StudentDashboardScreen.js   # Posts para alunos
│   │   ├── TeacherLoginScreen.js      # Login do professor
│   │   └── TeacherDashboardScreen.js  # Gerenciamento de posts
│   │
│   ├── styles/                     # Design tokens
│   │   ├── colors.js              # Paleta de cores
│   │   ├── spacing.js             # Espaçamento, raio, sombras
│   │   └── typography.js          # Tamanhos e pesos de fonte
│   │
│   ├── services/                   # Integração com APIs
│   └── assets/                     # Imagens e ícones
│
└── package.json
```

## 🎨 Design System

### Cores
- **Base**: Fundo escuro (#0f0e0b) com texto claro (#f5f0e8)
- **Aluno**: Azul (#7eb8f7)
- **Professor**: Ouro (#f7c97e)
- **Semântica**: Verde (sucesso), Vermelho (erro), Amarelo (aviso)

### Espaçamento
- Unidades: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), 2xl (32px)
- Raio de borda: 8px padrão
- Sombra: Elevation nativa do Android/iOS

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 14+ instalado
- Expo CLI instalado (`npm install -g expo-cli`)
- Expo Go app no seu telefone/emulador

### Instalação

```bash
cd BlogSchoolMobile
npm install
```

### Rodar o App

```bash
npm start
```

Isso abrirá a interface do Expo. Escolha uma das opções:
- **i**: Abrir no emulador iOS (macOS apenas)
- **a**: Abrir no emulador Android
- **w**: Abrir no navegador (web)
- Escanear QR code com Expo Go (iOS Camera ou app Android)

## 📖 Fluxo de Navegação

```
┌─────────────────────────────────────────────────────┐
│                   HomeScreen                        │
│     (Seleção: Aluno ou Professor)                  │
└──────┬──────────────────────────┬───────────────────┘
       │                          │
       ▼                          ▼
┌──────────────────┐    ┌──────────────────────────┐
│StudentDashboard  │    │  TeacherLoginScreen     │
│- Post list       │    │  - Code input (#####)   │
│- Search         │    │  - "prof2024" = sucesso  │
│- Filter tags    │    └──────────────┬───────────┘
│- View posts     │                   │
│- Logout         │                   ▼
└────────┬─────────┘    ┌──────────────────────────┐
         │              │TeacherDashboardScreen   │
         │              │- Post management        │
         │              │- Create new post        │
         │              │- Edit/delete            │
         │              │- Logout                 │
         │              └──────────────┬───────────┘
         └──────────────────────────────┘
              (Voltar para HomeScreen)
```

## 🔐 Acesso de Professor

Código padrão para login: **prof2024**

Para adicionar mais professores, edite `TeacherLoginScreen.js` e adicione novos códigos na array `validCodes`.

## 🔄 Integração com Backend

Atualmente, o app usa dados mock. Para conectar com o blog-api backend:

1. Crie um arquivo `.env` com:
```
API_URL=http://seu-backend:8080
```

2. Crie serviços em `src/services/`:
```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8080',
});

export const getPosts = () => API.get('/posts');
export const createPost = (data) => API.post('/posts', data);
// etc...
```

3. Use nos screens:
```javascript
import { getPosts } from '../services/api';

useEffect(() => {
  getPosts().then(res => setPosts(res.data));
}, []);
```

## 📝 Dados Mock

Atualmente fornecidos em cada screen:
- **StudentDashboard**: 3 posts de exemplo
- **TeacherDashboard**: Sistema de gerenciamento com dados locais

Para trocar por dados reais, substitua a lógica de `useState` por chamadas de API.

## 🐛 Troubleshooting

### "Cannot find module '@react-navigation/native'"
```bash
npm install @react-navigation/native @react-navigation/native-stack
```

### Porta 8081 em uso
Use uma porta diferente:
```bash
npm start -- --port 8082
```

### Emulador não carrega o app
- Confirme que o emulador e o PC estão na mesma rede
- Tente mode "tunnel" do Expo
- Reinicie o emulador

## 📲 Suportado

- ✅ Android (emulador ou físico)
- ✅ iOS (emulador ou físico)
- ✅ Web (navegador via Expo)

## 🎯 Próximos Passos

- [ ] API real integrada
- [ ] Autenticação com email/senha para professores
- [ ] Upload de imagens em posts
- [ ] Persistência de sessão (AsyncStorage)
- [ ] Notificações push
- [ ] Modo offline com sincronização
- [ ] Tema light mode

## 📄 Licença

Mesmo projeto que o blog-api backend.
