import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import HomeButton from '../components/HomeButton';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function HomeScreen({ navigation }) {
  const { login } = useContext(UserContext);

  const handleStudentPress = () => {
    login('student', 'Aluno');
    navigation.replace('StudentDashboard');
  };

  const handleTeacherPress = () => {
    login('teacher', 'Professor');
    navigation.replace('TeacherLogin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✏️</Text>
          <Text style={styles.title}>BlogSchool</Text>
          <Text style={styles.subtitle}>Blog colaborativo da turma</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Intro Text */}
        <Text style={styles.introText}>Escolha como deseja acessar:</Text>

        {/* Buttons */}
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
        <Text style={styles.footer}>
          Ambiente seguro para compartilhamento de conhecimento
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
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
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  footer: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed,
  },
});
