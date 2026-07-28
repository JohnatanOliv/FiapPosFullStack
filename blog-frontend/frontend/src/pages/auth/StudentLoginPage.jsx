import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { UserContext } from "../../context/UserContextValue";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email e senha são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.loginUser(email, password);
      const student = response.data.data;
      if (student.role !== "student") {
        setError("Este acesso é exclusivo para alunos.");
        return;
      }

      login(
        {
          id: student.id,
          name: student.name,
          email: student.email,
          role: student.role,
        },
        response.data.token
      );
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Falha ao autenticar aluno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login do Aluno</h1>
        <p style={styles.subtitle}>Use email e senha cadastrados pelo professor.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="aluno@email.com"
            disabled={loading}
          />

          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Digite sua senha"
            disabled={loading}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={styles.footer}>
          <Link to="/" style={styles.link}>Voltar ao início</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "24px",
  },
  title: { margin: 0, color: "var(--ink)", fontSize: "24px" },
  subtitle: { color: "var(--ink-muted)", marginTop: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" },
  label: { color: "var(--ink-muted)", fontSize: "12px", textTransform: "uppercase" },
  input: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px",
    color: "var(--ink)",
  },
  error: { color: "var(--accent)", fontSize: "13px" },
  button: {
    marginTop: "12px",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "12px",
    background: "var(--ink)",
    color: "#fff",
    cursor: "pointer",
  },
  footer: { marginTop: "16px", textAlign: "center" },
  link: { color: "var(--accent)", textDecoration: "none" },
};
