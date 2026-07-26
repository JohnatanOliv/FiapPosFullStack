import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

const MOCK_POSTS = [
  {
    id: '1',
    title: 'Aula 1 - Introdução ao React',
    excerpt: 'Nesta aula vamos aprender os fundamentos do React...',
    author: 'Você',
    date: '26 de jul',
    views: 45,
  },
  {
    id: '2',
    title: 'Exercício: Componentes',
    excerpt: 'Componentes reutilizáveis em React...',
    author: 'Você',
    date: '25 de jul',
    views: 32,
  },
];

export default function TeacherDashboardScreen({ navigation }) {
  const { logout } = useContext(UserContext);
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigation.replace('Home');
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
          title="Bem-vindo, Professor! 👋"
          subtitle="Gerencie seus posts e aulas."
        />

        {/* New Post Button */}
        <TouchableOpacity
          style={[
            styles.newPostBtn,
            { backgroundColor: theme.primary },
          ]}
        >
          <Text style={styles.newPostBtnText}>+ Novo Post</Text>
        </TouchableOpacity>

        {/* Posts List */}
        <View>
          <Text style={styles.postCount}>
            {MOCK_POSTS.length} post{MOCK_POSTS.length !== 1 ? 's' : ''}
          </Text>
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} onPress={() => { }} />
          ))}
        </View>
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
  newPostBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  newPostBtnText: {
    color: colors.bg,
    fontWeight: '600',
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
