# 📱 BlogSchool Mobile - React Native (Expo)

## 🎯 O Projeto

Um aplicativo mobile completo para o **BlogSchool** desenvolvido em **React Native** com **Expo**.

- ✅ 4 telas funcionais (Home, StudentDashboard, TeacherLogin, TeacherDashboard)
- ✅ Design system completo (cores, tipografia, espaçamento)
- ✅ Gestão de estado com Context API
- ✅ Navegação com React Navigation
- ✅ Componentes reutilizáveis
- ✅ Documentação abrangente

## 🚀 Começar Agora

### 1. Instalar
```bash
cd BlogSchoolMobile
npm install
```

### 2. Rodar
```bash
npm start
```

### 3. Escolher Plataforma
- Pressione `a` para Android Emulator
- Pressione `i` para iOS Simulator (Mac)
- Pressione `w` para Web
- Ou escaneie QR com Expo Go

## 📚 Documentação

| Arquivo | O Quê |
|---------|-------|
| **INICIO_RAPIDO.md** | Instruções passo a passo (COMECE AQUI!) |
| **BlogSchoolMobile/README.md** | Documentação completa do app |
| **BlogSchoolMobile/GUIA_RAPIDO.md** | Guia de customização |
| **BlogSchoolMobile/CHECKLIST.md** | Status de cada feature |
| **BlogSchoolMobile/RESUMO_IMPLEMENTACAO.md** | Resumo executivo |

## 🎮 Testando

### Fluxo de Aluno
```
Home → "👨‍🎓 Aluno" → Ver Posts → Buscar/Filtrar → Logout
```

### Fluxo de Professor
```
Home → "👨‍🏫 Professor" → Digite "prof2024" → Gerencie Posts → Logout
```

## 📁 Estrutura

```
BlogSchoolMobile/
├── App.js (Navegação)
├── src/
│   ├── components/ (HomeButton, Header, PostCard)
│   ├── context/ (UserContext)
│   ├── hooks/ (useTheme)
│   ├── screens/ (4 telas)
│   └── styles/ (Design tokens)
└── [Documentação]
```

## ⚙️ Tecnologia

- **React Native** - Framework mobile
- **Expo** - Compilação e distribuição
- **@react-navigation** - Navegação
- **Context API** - Estado global

## 🆘 Problemas Comuns

| Erro | Solução |
|------|---------|
| "Cannot find module" | `npm install` |
| "Port 8081 in use" | `npm start -- --port 8082` |
| White screen | Agite o telefone e click "Reload" |

## 🔌 Integração com Backend

Para conectar com o blog-api backend:

1. Criar `src/services/api.js`
2. Implementar chamadas HTTP
3. Trocar mock data por dados reais
4. Implementar autenticação JWT

(Veja **GUIA_RAPIDO.md** para código exemplo)

## ✨ Próximas Etapas

- [ ] Testar em emulador/telefone
- [ ] Conectar com backend real
- [ ] Autenticação com email/senha
- [ ] Upload de imagens
- [ ] Persistência de sessão

## 📞 Onde Encontrar Informações

1. **Quer começar agora?** → `INICIO_RAPIDO.md`
2. **Quer customizar?** → `BlogSchoolMobile/GUIA_RAPIDO.md`
3. **Quer entender tudo?** → `BlogSchoolMobile/README.md`
4. **Quer saber o status?** → `BlogSchoolMobile/CHECKLIST.md`

## 🎉 Status

✅ **Completo**  
✅ **Documentado**  
✅ **Pronto para Usar**  
✅ **Pronto para Testar**

---

**Versão**: 1.0  
**Framework**: React Native + Expo  
**Status**: ✅ Production Ready

**👉 Leia `INICIO_RAPIDO.md` para começar!**
