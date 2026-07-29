import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';
import { UserContext } from '../context/UserContext';
import { api } from '../services/api';

export default function TeacherLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Email e senha são obrigatórios.');

    setLoading(true);
    try {
      const response = await api.loginUser(email, password);
      if (response.data.role !== 'teacher') return setError('Este acesso é exclusivo para professores.');
      login({ user: response.data, token: response.token });
      navigation.replace('TeacherDashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/alunoeprof.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Login do Professor</Text>
        <Text style={styles.subtitle}>Entre com email e senha.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="professor@email.com" placeholderTextColor={colors.inkMuted} />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Digite sua senha" placeholderTextColor={colors.inkMuted} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Entrar</Text>}
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
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: spacing.md },
  title: { color: colors.ink, fontSize: typography.sizes['3xl'], fontWeight: '700', textAlign: 'center' },
  subtitle: { color: colors.inkMuted, marginTop: spacing.xs, marginBottom: spacing.xl, textAlign: 'center' },
  label: { color: colors.inkMuted, fontSize: typography.sizes.xs, marginBottom: spacing.xs, textTransform: 'uppercase' },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, color: colors.ink, padding: spacing.md, marginBottom: spacing.md },
  error: { color: colors.error, marginBottom: spacing.sm },
  submitBtn: { marginTop: spacing.md, backgroundColor: colors.accentRed, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
  backBtn: { color: colors.inkMuted, marginTop: spacing.lg, textAlign: 'center' },
});