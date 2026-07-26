import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

export default function TeacherLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loginMode, setLoginMode] = useState('code');
  const [error, setError] = useState('');

  const TEACHER_CODE = 'prof2024';

  const handleCodeSubmit = () => {
    if (code === TEACHER_CODE) {
      navigation.replace('TeacherDashboard');
    } else {
      setError('Código inválido.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>👨‍🏫</Text>
          <Text style={styles.title}>Professor</Text>
          <Text style={styles.subtitle}>Acesse sua sala</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Voltar</Text>
        </TouchableOpacity>

        {/* Code Input */}
        <Text style={styles.label}>Código de Acesso</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o código..."
          placeholderTextColor={colors.inkMuted}
          value={code}
          onChangeText={setCode}
          secureTextEntry
        />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleCodeSubmit}
        >
          <Text style={styles.submitBtnText}>Entrar</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.divider} />
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
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.inkMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  backBtn: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    color: colors.inkMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.ink,
    marginBottom: spacing.lg,
    fontSize: typography.sizes.base,
  },
  errorBox: {
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.2)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: '#f87171',
    fontSize: typography.sizes.sm,
  },
  submitBtn: {
    backgroundColor: colors.accentTeacher,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  submitBtnText: {
    color: colors.bg,
    fontWeight: '600',
    fontSize: typography.sizes.base,
  },
  footer: {
    fontSize: typography.sizes.xs,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: typography.lineHeights.relaxed,
  },
});
