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
  Image,
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

  const normalizePosts = (rawPosts = []) => {
    return rawPosts.map((item) => ({
      ...item,
      id: item._id || item.id,
      author: cleanText(item.author) || 'Autor',
      title: cleanText(item.title) || 'Sem título',
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '-',
      excerpt: cleanText(item.content),
      views: item.views || 0,
    }));
  };

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.listPosts();
      setPosts(normalizePosts(response.data));
    } catch (err) {
      setError(err.message);
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
      const response = await api.searchPosts(search);
      setPosts(normalizePosts(response.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    loadPosts();
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
          title={`Bem-vindo, ${user?.name || 'Aluno'} 👋`}
          subtitle="Explore os posts do blog da sua turma."
        />

        <View style={styles.searchBar}>
          <TextInput
            style={[styles.searchInput, { color: colors.ink }]}
            placeholder="Buscar por título, conteúdo ou autor..."
            placeholderTextColor={colors.inkMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: theme.primary }]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchBtnText}>{loading ? '...' : 'Buscar'}</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loading}>
            <Image
              source={require('../../assets/alunoeprof.png')}
              style={styles.loadingLogo}
              resizeMode="contain"
            />
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: colors.inkMuted }]}>
              Carregando posts...
            </Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={[styles.emptyText, { color: colors.inkMuted }]}>
              Nenhum post encontrado.
            </Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerLogo: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.ink,
  },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logoutBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.ink,
  },
  clearBtn: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    fontSize: typography.sizes.lg,
    color: colors.inkMuted,
  },
  searchBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchBtnText: {
    color: colors.bg,
    fontWeight: '600',
    fontSize: typography.sizes.base,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.md,
  },
  loadingLogo: {
    width: 88,
    height: 88,
    marginBottom: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sizes.base,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.base,
  },
  postCount: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.sm,
  },
});