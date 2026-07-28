import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

const emptyForm = { name: "", email: "", password: "" };

export default function UserManagementPage({ role }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const labels = useMemo(() => {
    return role === "teacher"
      ? { singular: "Professor", plural: "Professores" }
      : { singular: "Aluno", plural: "Alunos" };
  }, [role]);

  const apiRole = useMemo(() => (
    role === "teacher"
      ? {
        list: api.listTeachers,
        create: api.createTeacher,
        update: api.updateTeacher,
        remove: api.deleteTeacher,
      }
      : {
        list: api.listStudents,
        create: api.createStudent,
        update: api.updateStudent,
        remove: api.deleteStudent,
      }
  ), [role]);

  const load = async (nextPage = page, nextSearch = search) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRole.list({ page: nextPage, limit: 10, q: nextSearch });
      setItems(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || `Falha ao carregar ${labels.plural.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiRole.list({ page: 1, limit: 10, q: "" });
        if (!active) return;
        setItems(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || `Falha ao carregar ${labels.plural.toLowerCase()}.`);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [apiRole, labels.plural]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email };
        if (form.password.trim()) payload.password = form.password.trim();
        await apiRole.update(editing.id, payload);
      } else {
        await apiRole.create(form);
      }
      setForm(emptyForm);
      setEditing(null);
      await load(page, search);
    } catch (err) {
      setError(err.response?.data?.message || "Falha ao salvar.");
    }
  };

  const editItem = (item) => {
    setEditing(item);
    setForm({ name: item.name, email: item.email, password: "" });
  };

  const removeItem = async (id) => {
    setError("");
    try {
      await apiRole.remove(id);
      await load(page, search);
    } catch (err) {
      setError(err.response?.data?.message || "Falha ao excluir.");
    }
  };

  const searchSubmit = async (event) => {
    event.preventDefault();
    setPage(1);
    await load(1, search);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>{labels.plural}</h1>

      <form onSubmit={submit} style={styles.card}>
        <h2>{editing ? `Editar ${labels.singular}` : `Criar ${labels.singular}`}</h2>
        <input
          style={styles.input}
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm((old) => ({ ...old, name: e.target.value }))}
          required
        />
        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((old) => ({ ...old, email: e.target.value }))}
          required
        />
        <input
          style={styles.input}
          placeholder={editing ? "Nova senha (opcional)" : "Senha"}
          type="password"
          value={form.password}
          onChange={(e) => setForm((old) => ({ ...old, password: e.target.value }))}
          required={!editing}
        />
        <div style={styles.row}>
          <button style={styles.button} type="submit">
            {editing ? "Salvar alterações" : "Cadastrar"}
          </button>
          {editing && (
            <button
              style={styles.buttonGhost}
              type="button"
              onClick={() => { setEditing(null); setForm(emptyForm); }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <form onSubmit={searchSubmit} style={styles.search}>
        <input
          style={styles.input}
          value={search}
          placeholder={`Buscar ${labels.plural.toLowerCase()}...`}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.button} type="submit">Buscar</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p style={styles.muted}>Carregando...</p>
      ) : (
        <div style={styles.card}>
          {items.length === 0 ? (
            <p style={styles.muted}>Nenhum registro encontrado.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.email}</td>
                    <td style={styles.td}>
                      <button style={styles.buttonGhost} onClick={() => editItem(item)}>Editar</button>
                      <button style={styles.buttonGhost} onClick={() => removeItem(item.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={styles.row}>
            <button
              style={styles.buttonGhost}
              disabled={pagination.page <= 1}
              onClick={() => {
                const next = page - 1;
                setPage(next);
                load(next, search);
              }}
            >
              Anterior
            </button>
            <span style={styles.muted}>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              style={styles.buttonGhost}
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                load(next, search);
              }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { padding: "24px", color: "var(--ink)" },
  title: { marginTop: 0 },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "16px",
    marginBottom: "16px",
  },
  search: { display: "flex", gap: "8px", marginBottom: "12px" },
  input: {
    flex: 1,
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "10px",
    color: "var(--ink)",
  },
  row: { display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" },
  button: {
    border: "none",
    background: "var(--ink)",
    color: "#fff",
    borderRadius: "var(--radius)",
    padding: "10px 12px",
    cursor: "pointer",
  },
  buttonGhost: {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--ink-muted)",
    borderRadius: "var(--radius)",
    padding: "8px 10px",
    cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", borderBottom: "1px solid var(--border)", padding: "8px 0" },
  td: { borderBottom: "1px solid var(--border)", padding: "8px 0" },
  muted: { color: "var(--ink-muted)" },
  error: { color: "var(--accent)" },
};
