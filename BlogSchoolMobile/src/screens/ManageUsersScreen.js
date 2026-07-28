import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { api } from '../services/api';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

const initialForm = { name: '', email: '', password: '' };

export default function ManageUsersScreen({ route }) {
  const { token } = useContext(UserContext);
  const { role } = route.params;
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const labels = useMemo(() => (
    role === 'teacher'
      ? { singular: 'Professor', plural: 'Professores' }
      : { singular: 'Aluno', plural: 'Alunos' }
  ), [role]);

  const service = role === 'teacher'
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

  const load = async (nextPage = page, q = search) => {
    setError('');
    try {
      const response = await service.list(nextPage, q);
      setItems(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load(1, '');
  }, [role]);

  const submit = async () => {
    setError('');
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email };
        if (form.password.trim()) payload.password = form.password.trim();
        await service.update(editing.id, payload);
      } else {
        await service.create(form);
      }
      setEditing(null);
      setForm(initialForm);
      await load(page, search);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{labels.plural}</Text>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder={`Buscar ${labels.plural.toLowerCase()}...`}
          placeholderTextColor={colors.inkMuted}
        />
        <TouchableOpacity style={styles.btn} onPress={() => { setPage(1); load(1, search); }}>
          <Text style={styles.btnText}>Buscar</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{editing ? `Editar ${labels.singular}` : `Novo ${labels.singular}`}</Text>
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
          <TouchableOpacity style={styles.btn} onPress={submit}>
            <Text style={styles.btnText}>{editing ? 'Salvar' : 'Cadastrar'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnGhost}
                onPress={() => {
                  setEditing(item);
                  setForm({ name: item.name, email: item.email, password: '' });
                }}
              >
                <Text style={styles.btnGhostText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGhost} onPress={async () => { await service.remove(item.id); load(page, search); }}>
                <Text style={styles.btnGhostText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.actions}>
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
          <Text style={styles.pageInfo}>Página {pagination.page} de {pagination.totalPages}</Text>
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
  content: { padding: spacing.lg },
  title: { color: colors.ink, fontSize: typography.sizes['2xl'], fontWeight: '700', marginBottom: spacing.md },
  sectionTitle: { color: colors.ink, marginBottom: spacing.sm, fontWeight: '700' },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.ink,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  btn: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  name: { color: colors.ink, fontWeight: '700' },
  email: { color: colors.inkMuted, marginTop: spacing.xs },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  btnGhostText: { color: colors.inkMuted },
  pageInfo: { color: colors.inkMuted },
  error: { color: colors.error, marginBottom: spacing.sm },
});
