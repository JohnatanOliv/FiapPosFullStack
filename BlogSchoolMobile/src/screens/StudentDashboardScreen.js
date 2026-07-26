import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { colors } from '../styles/colors';
import { spacing, radius, shadows } from '../styles/spacing';
import { typography } from '../styles/typography';

// Mock data
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Introdução ao React Native',
    excerpt: 'Aprenda os fundamentos do desenvolvimento mobile com React Native...',
    author: 'Prof. João',
    date: '26 de jul',
    views: 145,
  },
  {
    id: '2',
    title: 'CSS Flexbox Avançado',
    excerpt: 'Dicas e truques para dominar o Flexbox e criar layouts responsivos...',
    author: 'Prof. Maria',
    date: '25 de jul',
    views: 89,
  },
  {
    id: '3',
    title: 'JavaScript Assíncrono',
    excerpt: 'Entenda Promises, async/await e callbacks em JavaScript...',
    author: 'Prof. Carlos',
    date: '24 de jul',
    views: 234,
  },
];

export default function StudentDashboardScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLogout = () => {
    logout();
    navigation.replace('Home');
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setPosts(MOCK_POSTS);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const filtered = MOCK_POSTS.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
      setPosts(filtered);
      setLoading(false);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPosts(MOCK_POSTS);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
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
          <Text style={[styles.logoutBtnText, { color: theme.primary }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Welcome */}
        <Header
          title="Bem-vindo ao Blog! 👋"
          subtitle="Explore os posts do blog da sua turma."
        />

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={[styles.searchInput, { color: colors.ink }]}
            placeholder="Buscar por título..."
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

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchBtn,
            { backgroundColor: theme.primary },
          ]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchBtnText}>
            {loading ? '...' : 'Buscar'}
          </Text>
        </TouchableOpacity>

        {/* Posts List */}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.primary} />
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
            <FlatList
              data={posts}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <PostCard post={item} onPress={() => { }} />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
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
});
