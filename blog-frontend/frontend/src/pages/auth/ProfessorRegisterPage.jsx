import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { UserContext } from "../../context/UserContextValue";
import logo from "../auth/img/alunoeprof.png";

export default function ProfessorRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !passwordConfirm || !name) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("As senhas não conferem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.registerUser(name, email, password, "teacher");
      if (response.data.success) {
        const teacher = response.data.data;
        login(
          {
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            role: teacher.role || "teacher",
          },
          response.data.token
        );
        navigate("/teacher");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.decorLine} />
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span><img src={logo} alt="logo" style={styles.logo} /></span>
          <h1 style={styles.title}>BlogSchool</h1>
          <p style={styles.subtitle}>Cadastro de Professor</p>
        </div>

        <div style={styles.divider} />

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nome Completo</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            disabled={loading}
            autoFocus
          />

          <label style={{ ...styles.label, marginTop: "12px" }}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            disabled={loading}
          />

          <label style={{ ...styles.label, marginTop: "12px" }}>Senha</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Digite uma senha"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            disabled={loading}
          />

          <label style={{ ...styles.label, marginTop: "12px" }}>Confirme a Senha</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Confirme sua senha"
            value={passwordConfirm}
            onChange={(e) => { setPasswordConfirm(e.target.value); setError(""); }}
            disabled={loading}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Registrando..." : "Criar Conta"}
          </button>
        </form>

        <div style={styles.divider} />

        <p style={styles.footer}>
          Já tem uma conta? <Link to="/professor-login" style={styles.link}>Faça login</Link>
        </p>

        <p style={styles.footer}>
          <Link to="/" style={styles.linkSecondary}>Voltar ao início</Link>
        </p>
      </div>

      <div style={styles.bgPattern} aria-hidden="true" />
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
    position: "relative",
    overflow: "hidden",
  },
  decorLine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "4px",
    background: "linear-gradient(90deg, var(--accent), var(--accent2))",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle, rgba(193,68,14,0.06) 1px, transparent 1px)`,
    backgroundSize: "32px 32px",
    zIndex: 0,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "400px",
    animation: "fadeUp 0.5s ease both",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "24px",
  },
  logo: {
    width: "100%",
    maxWidth: "150px",
    height: "auto",
    display: "block",
    margin: "0 auto 8px",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "13px",
    color: "var(--ink-muted)",
    marginTop: "4px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    margin: "24px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--ink-muted)",
  },
  input: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "12px 14px",
    fontSize: "15px",
    color: "var(--ink)",
    transition: "border-color 0.2s",
  },
  error: {
    fontSize: "13px",
    color: "var(--accent)",
    marginTop: "4px",
    marginBottom: "6px",
  },
  btn: {
    marginTop: "12px",
    background: "var(--ink)",
    color: "#fff",
    borderRadius: "var(--radius)",
    padding: "13px",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    transition: "background 0.2s, transform 0.1s",
    border: "none",
    cursor: "pointer",
  },
  footer: {
    marginTop: "12px",
    fontSize: "13px",
    color: "var(--ink-muted)",
    textAlign: "center",
    lineHeight: 1.5,
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 500,
  },
  linkSecondary: {
    color: "var(--ink-muted)",
    textDecoration: "none",
    fontWeight: 500,
  },
};
