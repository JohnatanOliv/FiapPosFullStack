import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import "./Dashboard.css";

export default function PostForm({ post, onSubmit, onClose, saving }) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [errors, setErrors] = useState({});
  const { user } = useContext(UserContext);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Título é obrigatório.";
    if (!content.trim()) e.content = "Conteúdo é obrigatório.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSubmit({ title: title.trim(), content: content.trim(), author: user?.name || "Anônimo" });
  };

  const isEdit = !!post;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box teacher-theme" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="form-title">{isEdit ? "Editar post" : "Novo post"}</h2>

        <div style={styles.authorInfo}>
          📝 Publicando como: <strong>{user?.name || "Anônimo"}</strong>
        </div>

        <div className="form-field">
          <label>Título</label>
          <input
            type="text"
            placeholder="Título do post"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((ev) => ({ ...ev, title: "" })); }}
          />
          {errors.title && <span style={{ color: "#f87171", fontSize: 12 }}>{errors.title}</span>}
        </div>

        <div className="form-field">
          <label>Conteúdo</label>
          <textarea
            placeholder="Escreva o conteúdo do post..."
            value={content}
            rows={8}
            onChange={(e) => { setContent(e.target.value); setErrors((ev) => ({ ...ev, content: "" })); }}
          />
          {errors.content && <span style={{ color: "#f87171", fontSize: 12 }}>{errors.content}</span>}
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={saving}>
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar post"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authorInfo: {
    padding: "12px",
    marginBottom: "16px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "var(--radius)",
    fontSize: "13px",
    color: "rgb(111, 111, 111)",
    fontWeight: 500,
  },
};

