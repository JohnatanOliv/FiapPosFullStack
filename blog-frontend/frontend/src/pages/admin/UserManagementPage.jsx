import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "../../styles/UserManagementPage.css";

const emptyForm = { name: "", email: "", password: "" };

export default function UserManagementPage({ role }) {
  const navigate = useNavigate();

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

  const apiRole = useMemo(
    () =>
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
        },
    [role]
  );

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
        if (active) setLoading(false);
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
    <div className={`user-mgmt-page ${role === "teacher" ? "theme-teacher" : "theme-student"}`}>
      <div className="user-mgmt-decor-line" />
      <div className="user-mgmt-bg-pattern" aria-hidden="true" />

      <div className="user-mgmt-card user-mgmt-header">
        <button
          type="button"
          className="user-mgmt-btn user-mgmt-btn-ghost"
          onClick={() => navigate(-1)}
          style={{ marginBottom: 12 }}
        >
          ← Voltar
        </button>

        <h1 className="user-mgmt-title">{labels.plural}</h1>
        <p className="user-mgmt-subtitle">Gerenciamento de {labels.plural.toLowerCase()}</p>
      </div>

      <form onSubmit={submit} className="user-mgmt-card">
        <h2 className="user-mgmt-section-title">{editing ? `Editar ${labels.singular}` : `Criar ${labels.singular}`}</h2>
        <input
          className="user-mgmt-input"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm((old) => ({ ...old, name: e.target.value }))}
          required
        />
        <input
          className="user-mgmt-input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((old) => ({ ...old, email: e.target.value }))}
          required
        />
        <input
          className="user-mgmt-input"
          placeholder={editing ? "Nova senha (opcional)" : "Senha"}
          type="password"
          value={form.password}
          onChange={(e) => setForm((old) => ({ ...old, password: e.target.value }))}
          required={!editing}
        />

        <div className="user-mgmt-row">
          <button className="user-mgmt-btn user-mgmt-btn-primary" type="submit">
            {editing ? "Salvar alterações" : "Cadastrar"}
          </button>
          {editing && (
            <button
              className="user-mgmt-btn user-mgmt-btn-ghost"
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <form onSubmit={searchSubmit} className="user-mgmt-card user-mgmt-search">
        <input
          className="user-mgmt-input"
          value={search}
          placeholder={`Buscar ${labels.plural.toLowerCase()}...`}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="user-mgmt-btn user-mgmt-btn-primary" type="submit">
          Buscar
        </button>
      </form>

      {error && <p className="user-mgmt-error">{error}</p>}

      {loading ? (
        <p className="user-mgmt-muted">Carregando...</p>
      ) : (
        <div className="user-mgmt-card">
          {items.length === 0 ? (
            <p className="user-mgmt-muted">Nenhum registro encontrado.</p>
          ) : (
            <table className="user-mgmt-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <button
                        type="button"
                        className="user-mgmt-btn user-mgmt-btn-ghost"
                        onClick={() => editItem(item)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="user-mgmt-btn user-mgmt-btn-ghost"
                        onClick={() => removeItem(item.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="user-mgmt-row">
            <button
              type="button"
              className="user-mgmt-btn user-mgmt-btn-ghost"
              disabled={pagination.page <= 1}
              onClick={() => {
                const next = page - 1;
                setPage(next);
                load(next, search);
              }}
            >
              Anterior
            </button>
            <span className="user-mgmt-muted">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              type="button"
              className="user-mgmt-btn user-mgmt-btn-ghost"
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