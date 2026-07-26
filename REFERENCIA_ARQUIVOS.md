# 📋 Referência Completa de Arquivos - BlogSchool Mobile

## 📁 Arquivos Criados/Modificados

### 🆕 Criados na Raiz do Projeto

| Arquivo | Tamanho | Propósito |
|---------|---------|----------|
| `README.md` | 3.0 KB | Overview do projeto |
| `INICIO_RAPIDO.md` | 6.0 KB | Instruções passo a passo |
| `PROJETO_COMPLETO.md` | 6.2 KB | Resumo completo |

### 🆕 Criados em `BlogSchoolMobile/`

| Arquivo | Tamanho | Propósito |
|---------|---------|----------|
| `App.js` | 2.0 KB | Navegação com React Navigation |
| `README.md` | 6.2 KB | Documentação do app |
| `GUIA_RAPIDO.md` | 4.7 KB | Guia de customização |
| `CHECKLIST.md` | 5.9 KB | Checklist de implementação |
| `RESUMO_IMPLEMENTACAO.md` | 9.5 KB | Resumo executivo |
| `.env.example` | 0.2 KB | Template de variáveis |

### 🆕 Criados em `BlogSchoolMobile/src/components/`

| Arquivo | Tamanho | O Quê |
|---------|---------|-------|
| `HomeButton.js` | 1.4 KB | Botão temático para aluno/professor |
| `Header.js` | 0.8 KB | Cabeçalho com logout |
| `PostCard.js` | 2.3 KB | Card de exibição de post |

### 🆕 Criados em `BlogSchoolMobile/src/context/`

| Arquivo | Tamanho | O Quê |
|---------|---------|-------|
| `UserContext.js` | 0.6 KB | Contexto global de usuário |

### 🆕 Criados em `BlogSchoolMobile/src/hooks/`

| Arquivo | Tamanho | O Quê |
|---------|---------|-------|
| `useTheme.js` | 0.3 KB | Hook para tema por papel |

### 🆕 Criados em `BlogSchoolMobile/src/screens/`

| Arquivo | Tamanho | O Quê |
|---------|---------|-------|
| `HomeScreen.js` | 3.2 KB | Seleção de papel (Aluno/Professor) |
| `StudentDashboardScreen.js` | 7.3 KB | Dashboard com posts para alunos |
| `TeacherLoginScreen.js` | 4.4 KB | Login do professor com código |
| `TeacherDashboardScreen.js` | 4.0 KB | Gerenciamento de posts |

### 🆕 Criados em `BlogSchoolMobile/src/styles/`

| Arquivo | Tamanho | O Quê |
|---------|---------|-------|
| `colors.js` | 0.8 KB | Paleta de cores (dark mode) |
| `typography.js` | 0.5 KB | Tipografia (fonts, sizes) |
| `spacing.js` | 0.7 KB | Espaçamento, raios, sombras |

---

## 📊 Totais

| Categoria | Quantidade | Tamanho |
|-----------|-----------|---------|
| **Arquivos de código** | 13 | ~25 KB |
| **Arquivos de documentação** | 6 | ~32 KB |
| **Total de arquivos** | 19 | ~57 KB |
| **Linhas de código** | ~1,500+ | - |

---

## 🎯 Como Usar Cada Arquivo

### Para Entender o Projeto
1. **README.md** (na raiz) - Visão geral
2. **INICIO_RAPIDO.md** - Começar
3. **BlogSchoolMobile/README.md** - Documentação completa

### Para Usar a App
1. `App.js` - Ponto de entrada da navegação
2. `src/screens/` - As 4 telas
3. `src/components/` - Componentes reutilizáveis

### Para Personalizar
1. `src/styles/colors.js` - Mudar cores
2. `src/styles/typography.js` - Mudar fonts
3. `src/styles/spacing.js` - Mudar espaçamento

### Para Integrar Backend
1. Criar `src/services/api.js`
2. Modificar screens para usar API
3. Consultar `GUIA_RAPIDO.md`

---

## 🔄 Fluxo de Navegação (em App.js)

```javascript
Stack.Navigator
├── HomeScreen
│   ├── handleStudentPress → StudentDashboardScreen
│   └── handleTeacherPress → TeacherLoginScreen
│
├── StudentDashboardScreen
│   └── logout → HomeScreen
│
├── TeacherLoginScreen
│   ├── valido (prof2024) → TeacherDashboardScreen
│   └── invalido → erro
│
└── TeacherDashboardScreen
    └── logout → HomeScreen
```

---

## 🎨 Estrutura de Estilos

### colors.js
```javascript
export const colors = {
  bg, surface, ink, inkMuted,          // Base
  accentStudent, accentTeacher,        // Temas
  success, error, warning, info,       // Semântica
  border, borderLight                  // Bordas
}
```

### typography.js
```javascript
export const typography = {
  sizes: { xs, sm, base, lg, xl, 2xl, 3xl, 4xl },  // 8 tamanhos
  weights: { 400, 500, 600, 700 },                 // 4 pesos
  lineHeights: { tight, normal, relaxed }          // 3 alturas
}
```

### spacing.js
```javascript
export const spacing = {
  xs: 4,  sm: 8,  md: 12,  lg: 16,  xl: 24,  2xl: 32,  // Unidades
  radius: 8,                                            // Borda
  shadows: { sm, md, lg }                              // Sombras
}
```

---

## 🧠 Componentes e Suas Props

### HomeButton
```javascript
<HomeButton
  label="Aluno"
  subtext="Acessar posts"
  icon="👨‍🎓"
  theme="student"  // ou "teacher"
  onPress={() => {}}
/>
```

### Header
```javascript
<Header
  title="StudentDashboard"
  onLogout={() => {}}
  userType="student"  // ou "teacher"
/>
```

### PostCard
```javascript
<PostCard
  title="Título do Post"
  author="Professor"
  category="react"
  excerpt="Breve descrição..."
  date="2024-01-15"
  views={150}
/>
```

---

## 🔗 Dependências Instaladas

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x"
}
```

---

## 📝 Convenções Usadas

### Nomes de Arquivo
- `HomeButton.js` - Componentes em PascalCase
- `useTheme.js` - Hooks em camelCase com "use"
- `UserContext.js` - Contextos em PascalCase com "Context"

### Estrutura de Pasta
```
src/
├── components/     → Componentes reutilizáveis
├── context/        → Contextos globais
├── hooks/          → Custom hooks
├── screens/        → Telas/Páginas
├── styles/         → Design tokens
├── services/       → APIs e serviços
└── assets/         → Imagens/ícones
```

### Estilo de Código
- StyleSheet.create() para estilos
- Sem CSS, puro React Native
- Props baseadas em design tokens
- Comments apenas onde necessário

---

## ✅ Checklist de Arquivos

- [x] App.js criado com navegação
- [x] 3 componentes criados (HomeButton, Header, PostCard)
- [x] 4 screens criadas (Home, StudentDashboard, TeacherLogin, TeacherDashboard)
- [x] UserContext.js criado
- [x] useTheme.js hook criado
- [x] colors.js design token criado
- [x] typography.js design token criado
- [x] spacing.js design token criado
- [x] 6 arquivos de documentação criados
- [x] package.json dependências atualizadas
- [x] .env.example criado
- [x] Navegação funcional implementada
- [x] Design system completo

---

## 🚀 Próximos Arquivos a Criar

### Para Backend
- `src/services/api.js` - Cliente HTTP
- `src/services/auth.js` - Autenticação
- `src/constants/config.js` - Configurações

### Para Features
- `src/screens/PostDetailScreen.js` - Detalhes do post
- `src/screens/CreatePostScreen.js` - Criar novo post
- `src/components/SearchBar.js` - Barra de busca

### Para Persistência
- Usar `AsyncStorage` para salvar sessão
- Cache local de posts

---

## 📞 Referências Rápidas

### Cores
```javascript
import { colors } from './src/styles/colors';
// colors.bg, colors.ink, colors.accentStudent
```

### Tipografia
```javascript
import { typography } from './src/styles/typography';
// typography.sizes.lg, typography.weights[700]
```

### Espaçamento
```javascript
import { spacing } from './src/styles/spacing';
// spacing.md, spacing.radius, spacing.shadows.lg
```

### Contexto
```javascript
const { user, userType, login, logout } = useContext(UserContext);
```

### Tema
```javascript
const theme = useTheme();  // Retorna studentTheme ou teacherTheme
```

---

## 🎁 Dicas

1. **Para adicionar nova tela:**
   - Criar arquivo em `src/screens/NovaScreen.js`
   - Adicionar ao Stack.Navigator em `App.js`
   - Importar componentes existentes

2. **Para customizar cores:**
   - Editar `src/styles/colors.js`
   - Mudar `primary`, `bg`, `ink`, etc

3. **Para adicionar componente:**
   - Criar em `src/components/NovoComponente.js`
   - Usar StyleSheet.create() para estilos
   - Exportar como default

4. **Para integrar API:**
   - Criar `src/services/api.js`
   - Usar axios ou fetch
   - Chamar em `useEffect` dos screens

---

**Última atualização**: 2024  
**Versão do projeto**: 1.0  
**Framework**: React Native + Expo
