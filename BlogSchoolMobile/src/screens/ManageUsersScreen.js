import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { api } from '../services/api';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

const initialForm = { name: '', email: '', password: '' };

export default function ManageUsersScreen({ route }) {
  const { token } = useContext(UserContext);
  const role = route?.params?.role || 'student';

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const labels = useMemo(
    () =>
      role === 'teacher'
        ? { singular: 'Professor', plural: 'Professores' }
        : { singular: 'Aluno', plural: 'Alunos' },
    [role],
  );

  const service =
    role === 'teacher'
      ? {
        list: (pageValue, q) => api.listTeachers(token, pageValue, q),
        create: (payload) => api.createTeacher(payload, token),
        update: (id, payload) => api.updateTeacher(id, payload, token),
        remove: (id) => api.deleteTeacher(id, token),
      }
      : {
        list: (pageValue, q) => api.listStudents(token, pageValue, q),
        create: (payload) => api.createStudent(payload, token),
        update: (id, payload) => api.updateStudent(id, payload, token),
        remove: (id) => api.deleteStudent(id, token),
      };

  const primaryColor = role === 'teacher' ? colors.accentRed : colors.accentGreen;

  const normalizeList = (response, nextPage) => {
    const dataList = response?.data?.data ?? response?.data ?? [];
    const pageInfo =
      response?.data?.pagination ??
      response?.pagination ??
      { page: nextPage, totalPages: 1 };

    setItems(Array.isArray(dataList) ? dataList : []);
    setPagination(pageInfo);
  };

  const load = async (nextPage = page, q = search) => {
    setLoading(true);
    setError('');
    try {
      const response = await service.list(nextPage, q);
      normalizeList(response, nextPage);
    } catch (err) {
      setItems([]);
      setPagination({ page: 1, totalPages: 1 });
      setError(err?.message || 'Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, '');
  }, [role]);

  const submit = async () => {
    setError('');

    if (!form.name.trim() || !form.email.trim() || (!editing && !form.password.trim())) {
      setError('Preencha os campos obrigatórios.');
      return;
    }

    try {
      if (editing) {
        const payload = { name: form.name.trim(), email: form.email.trim() };
        if (form.password.trim()) payload.password = form.password.trim();
        await service.update(editing.id || editing._id, payload);
      } else {
        await service.create({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
        });
      }

      setEditing(null);
      setForm(initialForm);
      await load(page, search);
    } catch (err) {
      setError(err?.message || 'Falha ao salvar.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>{role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}</Text>
          <Text style={styles.title}>{labels.plural}</Text>
          <Text style={styles.subtitle}>Gerenciamento da turma</Text>
        </View>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder={`Buscar ${labels.plural.toLowerCase()}...`}
          placeholderTextColor={colors.inkMuted}
        />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primaryColor }]}
          onPress={() => {
            setPage(1);
            load(1, search);
          }}
        >
          <Text style={styles.btnText}>Buscar</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {editing ? `Editar ${labels.singular}` : `Novo ${labels.singular}`}
          </Text>

          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(value) => setForm((old) => ({ ...old, name: value }))}
            placeholder="Nome"
            placeholderTextColor={colors.inkMuted}
          />
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(value) => setForm((old) => ({ ...old, email: value }))}
            placeholder="Email"
            placeholderTextColor={colors.inkMuted}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(value) => setForm((old) => ({ ...old, password: value }))}
            placeholder={editing ? 'Nova senha (opcional)' : 'Senha'}
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
          />

          <TouchableOpacity style={[styles.btn, { backgroundColor: primaryColor }]} onPress={submit}>
            <Text style={styles.btnText}>{editing ? 'Salvar' : 'Cadastrar'}</Text>
          </TouchableOpacity>

          {editing ? (
            <TouchableOpacity
              style={styles.btnGhost}
              onPress={() => {
                setEditing(null);
                setForm(initialForm);
              }}
            >
              <Text style={styles.btnGhostText}>Cancelar edição</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={primaryColor} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          items.map((item, index) => {
            const itemId = item.id || item._id || `item-${index}`;
            return (
              <View key={itemId} style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.btnGhost}
                    onPress={() => {
                      setEditing(item);
                      setForm({ name: item.name || '', email: item.email || '', password: '' });
                    }}
                  >
                    <Text style={styles.btnGhostText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnGhost}
                    onPress={async () => {
                      await service.remove(itemId);
                      load(page, search);
                    }}
                  >
                    <Text style={styles.btnGhostText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.pagination}>
          <TouchableOpacity
            style={styles.btnGhost}
            disabled={pagination.page <= 1}
            onPress={() => {
              const next = page - 1;
              setPage(next);
              load(next, search);
            }}
          >
            <Text style={styles.btnGhostText}>Anterior</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            Página {pagination.page} de {pagination.totalPages}
          </Text>

          <TouchableOpacity
            style={styles.btnGhost}
            disabled={pagination.page >= pagination.totalPages}
            onPress={() => {
              const next = page + 1;
              setPage(next);
              load(next, search);
            }}
          >
            <Text style={styles.btnGhostText}>Próxima</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing['3xl'] },

  header: { alignItems: 'center', marginBottom: spacing.lg },
  logo: { fontSize: 42, marginBottom: spacing.sm },
  title: { color: colors.ink, fontSize: typography.sizes['3xl'], fontWeight: '700' },
  subtitle: {
    color: colors.inkMuted,
    fontSize: typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  divider: { height: 1, backgroundColor: colors.borderLight, marginBottom: spacing.lg },

  sectionTitle: { color: colors.ink, marginBottom: spacing.sm, fontWeight: '700' },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },

  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  btnText: { color: '#fff', fontWeight: '700' },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  name: { color: colors.ink, fontWeight: '700', fontSize: typography.sizes.base },
  email: { color: colors.inkMuted, marginTop: spacing.xs, marginBottom: spacing.sm },

  actions: { flexDirection: 'row', flexWrap: 'wrap' },

  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface2,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  btnGhostText: { color: colors.inkMuted, fontWeight: '600' },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  pageInfo: { color: colors.inkMuted, fontSize: typography.sizes.xs },

  loadingWrap: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  loadingText: { marginTop: spacing.sm, color: colors.inkMuted },

  error: { color: colors.error, marginBottom: spacing.sm },
});