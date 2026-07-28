import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { UserContext } from '../context/UserContext';
import { api } from '../services/api';

export default function StudentLoginScreen({ navigation }) {
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
      if (response.data.role !== 'student') {
        setError('Este acesso é exclusivo para alunos.');
        return;
      }
      login({ user: response.data, token: response.token });
      navigation.replace('StudentDashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <Image
            source={require('../../assets/alunoeprof.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Login do Aluno</Text>
          <Text style={styles.subtitle}>Entre com email e senha.</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="aluno@email.com"
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

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={colors.accentStudent} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : null}

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
  brand: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { width: 110, height: 110, marginBottom: spacing.md },
  title: { color: colors.ink, fontSize: typography.sizes['3xl'], fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.inkMuted, marginTop: spacing.xs, textAlign: 'center' },
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
    backgroundColor: colors.accentStudent,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  submitText: { color: colors.bg, fontWeight: '700' },
  loadingBox: {
    marginTop: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.inkMuted,
    fontSize: typography.sizes.sm,
  },
  backBtn: { color: colors.inkMuted, marginTop: spacing.lg, textAlign: 'center' },
});