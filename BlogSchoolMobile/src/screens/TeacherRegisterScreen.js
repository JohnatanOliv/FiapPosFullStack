import React, { useState } from 'react';
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
import { api } from '../services/api';

export default function TeacherRegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError('');
        setSuccess('');

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Preencha nome, email e senha.');
            return;
        }

        setLoading(true);
        try {
            await api.registerUser(name.trim(), email.trim(), password.trim(), 'teacher');
            setSuccess('Professor cadastrado com sucesso!');
            setTimeout(() => navigation.replace('TeacherLogin'), 900);
        } catch (err) {
            setError(err?.message || 'Falha ao cadastrar professor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Cadastro de Professor</Text>
                <Text style={styles.subtitle}>Crie sua conta para gerenciar posts.</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor={colors.inkMuted}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.inkMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor={colors.inkMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}
                {success ? <Text style={styles.success}>{success}</Text> : null}

                <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.submitText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.replace('TeacherLogin')}>
                    <Text style={styles.backBtn}>Voltar para login</Text>
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
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        color: colors.ink,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    submitBtn: {
        marginTop: spacing.md,
        backgroundColor: colors.accentRed,
        borderRadius: radius.md,
        padding: spacing.md,
        alignItems: 'center',
    },
    submitText: { color: '#fff', fontWeight: '700' },
    backBtn: { color: colors.inkMuted, marginTop: spacing.lg, textAlign: 'center' },
    error: { color: colors.error, marginBottom: spacing.sm },
    success: { color: colors.success, marginBottom: spacing.sm },
});