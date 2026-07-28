import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { api } from '../services/api';

const emptyPost = { title: '', content: '' };

export default function TeacherDashboardRealScreen({ navigation }) {
  const { user, token, logout } = useContext(UserContext);
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState(emptyPost);

  const normalizePosts = (rawPosts) => {
    return rawPosts.map((item) => ({
      ...item,
      id: item._id,
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '-',
      excerpt: item.content,
      views: item.views || 0,
    }));
  };

  const loadPosts = async () => {
    setError('');
    try {
      const response = await api.listPosts();
      setPosts(normalizePosts(response.data));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const savePost = async () => {
    setError('');
    try {
      const payload = {
        title: postForm.title,
        content: postForm.content,
        author: user?.name || 'Professor',
      };
      if (editingPost) {
        await api.updatePost(editingPost.id, payload, token);
      } else {
        await api.createPost(payload, token);
      }
      setEditingPost(null);
      setPostForm(emptyPost);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const removePost = async (postId) => {
    setError('');
    try {
      await api.deletePost(postId, token);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.headerBrand}>
          <Text style={styles.headerLogo}>✏️</Text>
          <Text style={styles.headerTitle}>BlogSchool</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { borderColor: colors.border, backgroundColor: theme.primaryLight },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutBtnText, { color: theme.primary }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Header
          title={`Olá, Prof. ${user?.name || ''} 👋`}
          subtitle="Gerencie os posts e os usuários da turma."
        />

        <View style={styles.adminLinks}>
          <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('ManageUsers', { role: 'teacher' })}>
            <Text style={styles.adminBtnText}>Professores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('ManageUsers', { role: 'student' })}>
            <Text style={styles.adminBtnText}>Alunos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{editingPost ? 'Editar postagem' : 'Nova postagem'}</Text>
          <TextInput
            style={styles.input}
            value={postForm.title}
            onChangeText={(value) => setPostForm((old) => ({ ...old, title: value }))}
            placeholder="Título"
            placeholderTextColor={colors.inkMuted}
          />
          <TextInput
            style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
            multiline
            value={postForm.content}
            onChangeText={(value) => setPostForm((old) => ({ ...old, content: value }))}
            placeholder="Conteúdo"
            placeholderTextColor={colors.inkMuted}
          />
          <TouchableOpacity style={styles.btn} onPress={savePost}>
            <Text style={styles.btnText}>{editingPost ? 'Salvar alterações' : 'Criar post'}</Text>
          </TouchableOpacity>
          {editingPost ? (
            <TouchableOpacity
              style={styles.btnGhost}
              onPress={() => {
                setEditingPost(null);
                setPostForm(emptyPost);
              }}
            >
              <Text style={styles.btnGhostText}>Cancelar edição</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {posts.map((post) => (
          <View key={post.id}>
            <PostCard
              post={post}
              onPress={() => navigation.navigate('PostDetails', { postId: post.id })}
            />
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnGhost}
                onPress={() => {
                  setEditingPost(post);
                  setPostForm({ title: post.title, content: post.content });
                }}
              >
                <Text style={styles.btnGhostText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGhost} onPress={() => removePost(post.id)}>
                <Text style={styles.btnGhostText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerLogo: { fontSize: 22 },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.ink },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logoutBtnText: { fontSize: typography.sizes.xs, fontWeight: '500' },
  content: { flex: 1, padding: spacing.lg },
  adminLinks: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  adminBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  adminBtnText: { color: colors.ink },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: { color: colors.ink, fontWeight: '700', marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.ink,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  btn: {
    backgroundColor: colors.accentTeacher,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  btnText: { color: colors.bg, fontWeight: '700' },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  btnGhostText: { color: colors.inkMuted },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: -spacing.sm, marginBottom: spacing.md },
  error: { color: colors.error, marginBottom: spacing.sm },
});
