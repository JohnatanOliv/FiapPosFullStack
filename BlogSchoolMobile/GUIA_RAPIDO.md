# 🚀 Guia Rápido - BlogSchool Mobile

## 📥 Instalação Rápida

```bash
# 1. Navegue até a pasta do projeto
cd BlogSchoolMobile

# 2. Instale as dependências
npm install

# 3. Inicie o servidor Expo
npm start
```

## 📱 Opções de Execução

Ao rodar `npm start`, você verá:

```
i - Abrir no emulador iOS (Mac only)
a - Abrir no emulador Android
w - Abrir na web (navegador)
r - Recarregar
q - Sair
```

### Opção 1: Emulador Android
1. Tenha Android Studio com emulador instalado
2. Pressione `a`

### Opção 2: Emulador iOS
1. Tenha Xcode instalado (Mac only)
2. Pressione `i`

### Opção 3: Expo Go App
1. Instale o app "Expo Go" no seu telefone
2. Escaneie o QR code que aparece no terminal
3. O app abrirá automaticamente

## 🎮 Testando a Aplicação

### Fluxo de Aluno
1. **Home**: Clique em "Aluno"
2. **Dashboard**: Veja lista de posts
3. **Busca**: Teste a busca de posts (ex: "React")
4. **Filtros**: Clique nas tags para filtrar
5. **Logout**: Botão no topo para voltar

### Fluxo de Professor
1. **Home**: Clique em "Professor"
2. **Login**: Digite o código: **prof2024**
3. **Dashboard**: Veja a listagem de posts
4. **Gerenciar**: Crie, edite ou delete posts
5. **Logout**: Botão no topo para voltar

## 🛠️ Modificações Importantes

### Adicionar Novo Professor
Editar: `src/screens/TeacherLoginScreen.js`

```javascript
// Linha ~25 - Adicione ao array:
const validCodes = ['prof2024', 'novo_codigo_aqui'];
```

### Mudar Dados Mock
Editar: `src/screens/StudentDashboardScreen.js`

```javascript
// Linha ~31 - Modifique o array mockPosts:
const mockPosts = [
  {
    id: 1,
    title: 'Meu título',
    author: 'Nome do professor',
    category: 'react', // ou 'javascript', 'design', 'outros'
    excerpt: 'Breve descrição...',
    content: 'Conteúdo completo...',
    date: '2024-01-15',
    views: 150,
  },
  // ...
];
```

### Conectar com Backend Real
Crie `src/services/api.js`:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8080',
  timeout: 10000,
});

export const getPosts = () => API.get('/posts');
export const getPostById = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export default API;
```

Depois use em `StudentDashboardScreen.js`:

```javascript
import { getPosts } from '../services/api';

useEffect(() => {
  getPosts()
    .then(response => setPosts(response.data))
    .catch(error => console.error('Erro:', error));
}, []);
```

## 🎨 Personalizar Tema

Editar: `src/styles/colors.js`

```javascript
export const colors = {
  bg: '#0f0e0b',        // Fundo principal
  ink: '#f5f0e8',       // Texto principal
  // ...
};

export const studentTheme = {
  primary: '#7eb8f7',   // Cor do aluno (azul)
};

export const teacherTheme = {
  primary: '#f7c97e',   // Cor do professor (ouro)
};
```

## 🔄 Recarregar o App

Durante desenvolvimento, o app recarrega automaticamente ao salvar arquivos. Se não funcionar:

- Pressione `r` no terminal
- Ou agite o telefone (Android) / Three finger swipe (iOS)

## ⚠️ Erros Comuns

| Erro | Solução |
|------|---------|
| "Cannot find module" | `npm install` novamente |
| "Port 8081 in use" | `npm start -- --port 8082` |
| "Permission denied" (Android) | Permita em `Settings > Apps > Permissions` |
| "White screen" | Agite o telefone e selecione "Reload" |

## 📚 Arquivos Principais para Editar

| Arquivo | Propósito | Editar para |
|---------|-----------|------------|
| `App.js` | Navegação | Adicionar/remover telas |
| `src/styles/colors.js` | Cores | Mudar tema |
| `src/screens/HomeScreen.js` | Tela inicial | Mudança de UI |
| `src/screens/StudentDashboardScreen.js` | Dashboard aluno | Lógica de posts |
| `src/screens/TeacherLoginScreen.js` | Login professor | Validação |
| `src/screens/TeacherDashboardScreen.js` | Dashboard professor | Gerenciamento |

## 🆘 Suporte

Para problemas específicos, consulte:
1. `README.md` - Documentação geral
2. Logs do terminal (erros aparecem lá)
3. React Native docs: https://reactnative.dev
4. Expo docs: https://docs.expo.dev

## 📱 Próximos Passos

- [ ] Integrar com blog-api backend
- [ ] Adicionar autenticação via email
- [ ] Implementar upload de imagens
- [ ] Salvar sessão do usuário
- [ ] Dark/Light mode toggle

---

**Versão**: 1.0  
**Último atualizado**: 2024  
**Framework**: React Native + Expo
