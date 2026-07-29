import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState(emptyPost);

  const cleanText = (value) =>
    String(value || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/-{3,}/g, ' ')
      .replace(/\{\s*"\$oid":[^}]+\}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const toArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const normalizePosts = (rawPosts = []) =>
    rawPosts.map((item, index) => ({
      ...item,
      id: item?._id || item?.id || `post-${index}`,
      author: cleanText(item?.author) || 'Professor',
      title: cleanText(item?.title) || 'Sem título',
      content: cleanText(item?.content),
      excerpt: cleanText(item?.content),
      date: item?.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '-',
    }));

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.listPosts();
      setPosts(normalizePosts(toArray(response?.data || response)));
    } catch (err) {
      setError(err?.message || 'Falha ao carregar posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const savePost = async () => {
    setError('');

    if (!postForm.title.trim() || !postForm.content.trim()) {
      setError('Título e conteúdo são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: postForm.title.trim(),
        content: postForm.content.trim(),
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
      setError(err?.message || 'Falha ao salvar post.');
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (postId) => {
    setError('');
    try {
      await api.deletePost(postId, token);
      await loadPosts();
    } catch (err) {
      setError(err?.message || 'Falha ao excluir post.');
    }
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <Text style={styles.headerLogo}>✏️</Text>
          <Text style={styles.headerTitle}>BlogSchool</Text>
        </View>
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.border, backgroundColor: theme.primaryLight }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutBtnText, { color: theme.primary }]}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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
          <Text style={styles.sectionTitle}>
            {editingPost ? 'Editar postagem' : 'Nova postagem'}
          </Text>

          <TextInput
            style={styles.input}
            value={postForm.title}
            onChangeText={(value) => setPostForm((old) => ({ ...old, title: value }))}
            placeholder="Título"
            placeholderTextColor={colors.inkMuted}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={postForm.content}
            onChangeText={(value) => setPostForm((old) => ({ ...old, content: value }))}
            placeholder="Conteúdo"
            placeholderTextColor={colors.inkMuted}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.btn} onPress={savePost} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {editingPost ? 'Salvar alterações' : 'Criar post'}
              </Text>
            )}
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

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.accentRed} />
            <Text style={styles.loadingText}>Carregando posts...</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postWrap}>
              <PostCard
                post={post}
                onPress={() => navigation.navigate('PostDetails', { postId: post.id })}
              />
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btnGhost}
                  onPress={() => {
                    setEditingPost(post);
                    setPostForm({ title: post.title || '', content: post.content || '' });
                  }}
                >
                  <Text style={styles.btnGhostText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnGhost} onPress={() => removePost(post.id)}>
                  <Text style={styles.btnGhostText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { fontSize: 22, marginRight: spacing.sm },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.ink },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logoutBtnText: { fontSize: typography.sizes.xs, fontWeight: '700' },

  content: { flex: 1 },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing['3xl'] },

  adminLinks: { flexDirection: 'row', marginBottom: spacing.md },
  adminBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  adminBtnText: { color: colors.ink, fontWeight: '600' },

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
  textArea: {
    minHeight: 100,
  },
  btn: {
    backgroundColor: colors.accentRed,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  btnGhostText: { color: colors.inkMuted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  postWrap: { marginBottom: spacing.sm },

  loadingWrap: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  loadingText: { color: colors.inkMuted, marginTop: spacing.sm },

  error: { color: colors.error, marginBottom: spacing.sm },
});