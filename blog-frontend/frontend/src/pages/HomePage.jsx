import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import logo from "./auth/img/alunoeprof.png";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleStudentAccess = () => {
    login("student", "Aluno");
    navigate("/student");
  };

  const handleProfessorAccess = () => {
    navigate("/professor-login");
  };

  return (
    <div style={styles.wrapper} className="home-page">
      <div style={styles.decorLine} />
      <div style={styles.card} className="home-card">
        <div style={styles.logoArea} className="home-logo-area">
          <span><img src={logo} alt="logo" style={styles.logo} /></span>
          <h1 style={styles.title} className="home-title">BlogSchool</h1>
          <p style={styles.subtitle} className="home-subtitle">Blog colaborativo da turma</p>
        </div>

        <div style={styles.divider} />

        <p style={styles.introText} className="home-intro">
          Escolha como deseja acessar:
        </p>

        <div style={styles.buttonContainer} className="home-button-container">
          <button
            style={{ ...styles.btn, ...styles.studentBtn }}
            onClick={handleStudentAccess}
            className="home-btn home-btn-student"
          >
            <div style={styles.btnIcon} className="home-btn-icon">👨‍🎓</div>
            <div style={styles.btnLabel} className="home-btn-label">Aluno</div>
            <div style={styles.btnSubtext} className="home-btn-subtext">Acessar posts</div>
          </button>

          <button
            style={{ ...styles.btn, ...styles.professorBtn }}
            onClick={handleProfessorAccess}
            className="home-btn home-btn-professor"
          >
            <div style={styles.btnIcon} className="home-btn-icon">👨‍🏫</div>
            <div style={styles.btnLabel} className="home-btn-label">Professor</div>
            <div style={styles.btnSubtext} className="home-btn-subtext">Gerenciar posts</div>
          </button>
        </div>

        <div style={styles.divider} />

        <p style={styles.footer} className="home-footer">
          Ambiente seguro para compartilhamento de conhecimento
        </p>
      </div>

      <div style={styles.bgPattern} aria-hidden="true" />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>
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
    padding: "16px",
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
    padding: "clamp(24px, 8vw, 48px) clamp(16px, 6vw, 40px)",
    width: "100%",
    maxWidth: "480px",
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
    fontSize: "clamp(20px, 6vw, 28px)",
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "clamp(11px, 3vw, 13px)",
    color: "var(--ink-muted)",
    marginTop: "4px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    margin: "clamp(12px, 4vw, 24px) 0",
  },
  introText: {
    fontSize: "clamp(12px, 3vw, 14px)",
    color: "var(--ink)",
    textAlign: "center",
    marginBottom: "clamp(12px, 4vw, 24px)",
    fontWeight: 500,
  },
  buttonContainer: {
    display: "flex",
    gap: "clamp(10px, 4vw, 16px)",
    flexDirection: "column",
  },
  btn: {
    padding: "clamp(16px, 5vw, 24px)",
    borderRadius: "var(--radius)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    fontWeight: 500,
    minHeight: "44px",
  },
  btnIcon: {
    fontSize: "clamp(28px, 10vw, 40px)",
  },
  btnLabel: {
    fontSize: "clamp(14px, 3vw, 16px)",
    fontWeight: 600,
  },
  btnSubtext: {
    fontSize: "clamp(10px, 2vw, 12px)",
    opacity: 0.7,
    marginTop: "4px",
  },
  studentBtn: {
    background: "linear-gradient(135deg, #2d6a4f, #1b4332)",
    color: "#fff",
  },
  professorBtn: {
    background: "linear-gradient(135deg, #c1440e, #7f2704)",
    color: "#fff",
  },
  footer: {
    marginTop: "clamp(8px, 3vw, 12px)",
    fontSize: "clamp(11px, 2vw, 12px)",
    color: "var(--ink-muted)",
    textAlign: "center",
    lineHeight: 1.5,
  },
};
