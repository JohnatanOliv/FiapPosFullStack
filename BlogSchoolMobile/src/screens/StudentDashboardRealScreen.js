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

export default function StudentDashboardRealScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

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
      author: cleanText(item?.author) || 'Autor',
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

  const handleLogout = () => {
    logout();
    navigation.replace('Home');
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadPosts();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.searchPosts(search.trim());
      setPosts(normalizePosts(toArray(response?.data || response)));
    } catch (err) {
      setError(err?.message || 'Falha ao buscar posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    loadPosts();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <Text style={styles.headerLogo}>✏️</Text>
          <Text style={styles.headerTitle}>BlogSchool</Text>
        </View>

        {user ? (
          <TouchableOpacity
            style={[styles.topBtn, { borderColor: colors.border, backgroundColor: theme.primaryLight }]}
            onPress={handleLogout}
          >
            <Text style={[styles.topBtnText, { color: theme.primary }]}>Sair</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.topBtn, { borderColor: colors.border, backgroundColor: colors.surface2 }]}
            onPress={() => navigation.navigate('StudentLogin')}
          >
            <Text style={styles.topBtnText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Header
          title={`Bem-vindo, ${user?.name || 'Visitante'} 👋`}
          subtitle="Explore os posts do blog da sua turma."
        />

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título, conteúdo ou autor..."
            placeholderTextColor={colors.inkMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearSearch}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: theme.primary }]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchBtnText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={styles.loadingText}>Carregando posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.postCount}>
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </Text>
            {posts.map((item) => (
              <PostCard
                key={item.id}
                post={item}
                onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
              />
            ))}
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  topBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topBtnText: { color: colors.ink, fontSize: typography.sizes.xs, fontWeight: '700' },

  content: { flex: 1 },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing['3xl'] },

  searchBar: { position: 'relative', marginBottom: spacing.md },
  searchInput: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.ink,
    fontSize: typography.sizes.base,
  },
  clearBtn: { position: 'absolute', right: spacing.md, top: spacing.md },
  clearBtnText: { color: colors.inkMuted, fontWeight: '700' },

  searchBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchBtnText: {
    color: colors.bg,
    fontWeight: '700',
    fontSize: typography.sizes.base,
  },

  loading: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  loadingText: { marginTop: spacing.sm, color: colors.inkMuted },

  empty: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { color: colors.inkMuted, fontSize: typography.sizes.base },

  postCount: {
    color: colors.inkMuted,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  errorText: { color: colors.error, marginTop: spacing.sm },
});