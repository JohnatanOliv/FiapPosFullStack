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
      views: item?.views || 0,
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
      <View style={styles.topbar}>
        <View style={styles.brandWrap}>
          <Text style={styles.brandIcon}>✏️</Text>
          <Text style={styles.brandText}>BlogSchool</Text>
        </View>
        <TouchableOpacity
          style={[styles.topbarBtn, { borderColor: colors.border, backgroundColor: theme.primaryLight }]}
          onPress={handleLogout}
        >
          <Text style={styles.topbarBtnText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Header
          title={`Olá, Prof. ${user?.name || ''} 👋`}
          subtitle="Gerencie posts e usuários da turma."
        />

        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={styles.segmentBtn}
            onPress={() => navigation.navigate('ManageUsers', { role: 'teacher' })}
          >
            <Text style={styles.segmentBtnText}>Professores</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.segmentBtn}
            onPress={() => navigation.navigate('ManageUsers', { role: 'student' })}
          >
            <Text style={styles.segmentBtnText}>Alunos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
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
            style={[styles.input, styles.textarea]}
            multiline
            value={postForm.content}
            onChangeText={(value) => setPostForm((old) => ({ ...old, content: value }))}
            placeholder="Conteúdo"
            placeholderTextColor={colors.inkMuted}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.accentRed }]}
            onPress={savePost}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {editingPost ? 'Salvar alterações' : 'Criar post'}
              </Text>
            )}
          </TouchableOpacity>

          {editingPost ? (
            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => {
                setEditingPost(null);
                setPostForm(emptyPost);
              }}
            >
              <Text style={styles.ghostBtnText}>Cancelar edição</Text>
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
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setEditingPost(post);
                    setPostForm({ title: post.title || '', content: post.content || '' });
                  }}
                >
                  <Text style={styles.actionBtnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => removePost(post.id)}>
                  <Text style={styles.actionBtnText}>Excluir</Text>
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

  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center' },
  brandIcon: { fontSize: 22, marginRight: spacing.sm },
  brandText: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.ink },
  topbarBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topbarBtnText: { color: colors.ink, fontWeight: '700', fontSize: typography.sizes.xs },

  content: { flex: 1 },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing['3xl'] },

  segmentRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  segmentBtn: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  segmentBtnText: { color: colors.ink, fontWeight: '600' },

  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: typography.sizes.lg,
    marginBottom: spacing.sm,
  },

  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    fontSize: typography.sizes.base,
  },
  textarea: { minHeight: 110 },

  primaryBtn: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },

  ghostBtn: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface2,
  },
  ghostBtnText: { color: colors.inkMuted, fontWeight: '600' },

  loadingWrap: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  loadingText: { color: colors.inkMuted, marginTop: spacing.sm },

  postWrap: { marginBottom: spacing.md },
  actionRow: { flexDirection: 'row', marginTop: -spacing.xs },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  actionBtnText: { color: colors.inkMuted, fontWeight: '600' },

  error: { color: colors.error, marginBottom: spacing.sm },
});