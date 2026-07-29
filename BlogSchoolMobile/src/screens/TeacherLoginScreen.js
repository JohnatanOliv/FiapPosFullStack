import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { UserContext } from '../context/UserContext';
import { api } from '../services/api';
import AppLoading from '../components/AppLoading';

export default function TeacherLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.loginUser(email, password);
      const userData = response?.data ?? response?.user ?? response;
      const tokenData = response?.token ?? response?.data?.token ?? null;

      if (userData?.role !== 'teacher') {
        setError('Este acesso é exclusivo para professores.');
        return;
      }

      login({ user: userData, token: tokenData });
      navigation.replace('TeacherDashboard');
    } catch (err) {
      setError(err?.message || 'Falha no login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login do Professor</Text>
        <Text style={styles.subtitle}>Entre com email e senha.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="professor@email.com"
          placeholderTextColor={colors.inkMuted}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError('');
          }}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor={colors.inkMuted}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError('');
          }}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>
        {loading ? <AppLoading message="Validando acesso..." /> : null}

        <TouchableOpacity onPress={() => navigation.navigate('TeacherRegister')}>
          <Text style={styles.registerBtn}>Criar conta de professor</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Home')}>
          <Text style={styles.backBtn}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { color: colors.ink, fontSize: typography.sizes['3xl'], fontWeight: '700' },
  subtitle: { color: colors.inkMuted, marginTop: spacing.xs, marginBottom: spacing.xl },
  label: {
    color: colors.inkMuted,
    fontSize: typography.sizes.xs,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.ink,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  error: { color: colors.error, marginBottom: spacing.sm },
  submitBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.accentTeacher,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  submitText: { color: colors.bg, fontWeight: '700' },
  registerBtn: {
    color: colors.ink,
    marginTop: spacing.lg,
    textAlign: 'center',
    fontWeight: '600',
  },
  backBtn: { color: colors.inkMuted, marginTop: spacing.md, textAlign: 'center' },
});