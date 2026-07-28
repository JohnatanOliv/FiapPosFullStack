import { useState } from "react";

export default function PostCard({ post, isTeacher, onEdit, onDelete, onClick }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const date = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <article style={styles.card} onClick={onClick}>
      <div style={styles.meta}>
        <span style={styles.author}>{post.author}</span>
        <span style={styles.dot}>·</span>
        <span style={styles.date}>{date}</span>
      </div>
      <h2 style={styles.title}>{post.title}</h2>
      <p style={styles.content}>{post.content}</p>

      {isTeacher && (
        <div style={styles.actions}>
          {confirmDelete ? (
            <>
              <span style={styles.confirmText}>Confirmar exclusão?</span>
              <button style={styles.btnDanger} onClick={(e) => { e.stopPropagation(); onDelete(e); }}>Sim, excluir</button>
              <button style={styles.btnGhost} onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}>Cancelar</button>
            </>
          ) : (
            <>
              <button style={styles.btnSecondary} onClick={(e) => { e.stopPropagation(); onEdit(e); }}>Editar</button>
              <button style={styles.btnGhost} onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}>Excluir</button>
            </>
          )}
        </div>
      )}
    </article>
  );
}

const styles = {
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "28px 32px",
    transition: "box-shadow 0.2s, transform 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "10px",
  },
  author: {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  dot: { color: "var(--border)", fontSize: "16px" },
  date: { fontSize: "12px", color: "var(--ink-muted)" },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: 1.25,
    color: "var(--ink)",
    marginBottom: "12px",
  },
  content: {
    fontSize: "14px",
    color: "var(--ink-muted)",
    lineHeight: 1.7,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    flex: 1,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid var(--border)",
  },
  confirmText: { fontSize: "13px", color: "var(--ink-muted)", marginRight: "4px" },
  btnSecondary: {
    padding: "7px 14px",
    background: "var(--accent)",
    color: "var(--ink)",
    borderRadius: "var(--radius)",
    fontSize: "13px",
    fontWeight: 500,
    border: "1px solid transparent",
  },
  btnDanger: {
    padding: "7px 14px",
    background: "var(--accent)",
    color: "#fff",
    borderRadius: "var(--radius)",
    fontSize: "13px",
    fontWeight: 500,
  },
  btnGhost: {
    padding: "7px 14px",
    background: "transparent",
    color: "var(--ink-muted)",
    borderRadius: "var(--radius)",
    fontSize: "13px",
    border: "1px solid var(--border)",
  },
};
