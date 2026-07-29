import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import HomeButton from '../components/HomeButton';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function HomeScreen({ navigation }) {
  const handleStudentPress = () => {
    // visitante pode ver posts sem login
    navigation.replace('StudentDashboard');
  };

  const handleTeacherPress = () => {
    navigation.replace('TeacherLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>✏️</Text>
          <Text style={styles.title}>BlogSchool</Text>
          <Text style={styles.subtitle}>Blog colaborativo da turma</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.introText}>Escolha como deseja acessar:</Text>

        <View style={styles.buttonContainer}>
          <HomeButton
            label="Aluno"
            subtext="Acessar posts"
            icon="👨‍🎓"
            theme="student"
            onPress={handleStudentPress}
          />
          <HomeButton
            label="Professor"
            subtext="Gerenciar posts"
            icon="👨‍🏫"
            theme="teacher"
            onPress={handleTeacherPress}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.footer}>
          Ambiente seguro para compartilhamento de conhecimento
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: 48, marginBottom: spacing.md },
  title: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  introText: {
    fontSize: typography.sizes.base,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  footer: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});