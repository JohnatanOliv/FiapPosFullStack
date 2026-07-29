import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { UserContext } from "../context/UserContextValue";
import "../styles/UserManagementPage.css";

export default function PostDetailsPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const isGuestViewer = !user;
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        api.getPost(id),
        api.listComments(id),
      ]);
      setPost(postResponse.data.data);
      setComments(commentsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar o post.");
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
        const [postResponse, commentsResponse] = await Promise.all([
          api.getPost(id),
          api.listComments(id),
        ]);
        if (!active) return;
        setPost(postResponse.data.data);
        setComments(commentsResponse.data.data);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || "Não foi possível carregar o post.");
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
  }, [id]);

  const handleCreateComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      setError("Faça login para comentar.");
      return;
    }

    try {
      await api.createComment(id, commentText.trim());
      setCommentText("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Falha ao comentar.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(id, commentId);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Falha ao excluir comentário.");
    }
  };

  return (
    <div className="user-mgmt-page theme-teacher">
      <div className="user-mgmt-decor-line" />
      <div className="user-mgmt-bg-pattern" aria-hidden="true" />

      <div className="user-mgmt-card" style={styles.container}>
        <button
          type="button"
          className="user-mgmt-btn user-mgmt-btn-primary"
          style={styles.back}
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>

        {loading ? (
          <p className="user-mgmt-muted">Carregando...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <>
            <h1 className="user-mgmt-title" style={styles.title}>{post?.title}</h1>
            <p style={styles.meta}>
              Por {post?.author} • {new Date(post?.createdAt).toLocaleDateString("pt-BR")}
            </p>
            <article style={styles.content}>{post?.content}</article>

            <section style={styles.section}>
              <h2 className="user-mgmt-section-title">Comentários</h2>
              {isGuestViewer ? (
                <p className="user-mgmt-muted">
                  Você está visualizando em modo leitura. Para comentar, faça login:
                  {" "}
                  <Link to="/student-login">Aluno</Link>
                  {" "}
                  ou
                  {" "}
                  <Link to="/professor-login">Professor</Link>.
                </p>
              ) : (
                <form onSubmit={handleCreateComment} style={styles.form}>
                  <textarea
                    className="user-mgmt-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva seu comentário..."
                    style={styles.textarea}
                  />
                  <button className="user-mgmt-btn user-mgmt-btn-primary" type="submit" style={styles.button}>
                    Comentar
                  </button>
                </form>
              )}

              {comments.length === 0 ? (
                <p className="user-mgmt-muted">Ainda não há comentários.</p>
              ) : (
                comments.map((comment) => {
                  const canDelete = user && (user.role === "teacher" || user.id === comment.authorId);
                  return (
                    <div key={comment.id} style={styles.comment}>
                      <p style={styles.commentMeta}>
                        {comment.authorName} ({comment.authorRole}) • {" "}
                        {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <p style={styles.commentContent}>{comment.content}</p>
                      {canDelete && (
                        <button
                          className="user-mgmt-btn user-mgmt-btn-ghost"
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "980px",
    margin: "0 auto",
    color: "#f5f0e8",
    padding: "24px",
  },
  back: {
    marginBottom: "18px",
    borderRadius: "14px",
    padding: "10px 14px",
  },
  title: { marginTop: "0", marginBottom: "8px", color: "#f5f0e8" },
  meta: { color: "rgba(245,245,245,0.55)", marginBottom: "20px" },
  content: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.8,
    color: "#f5f0e8",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    marginTop: "12px",
  },
  section: { marginTop: "28px" },
  sectionTitle: { marginBottom: "14px", color: "#f5f0e8" },
  form: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "16px" },
  textarea: {
    minHeight: "120px",
    borderRadius: "14px",
    padding: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f5f0e8",
  },
  button: { width: "fit-content", background: "var(--accent)" },
  comment: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.03)",
    padding: "18px",
    marginBottom: "14px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  commentMeta: { margin: 0, color: "rgba(245,245,245,0.65)", fontSize: "12px" },
  commentContent: { margin: "10px 0 0", color: "#f5f0e8" },
  deleteBtn: { marginTop: "10px", padding: "8px 12px" },
  muted: { color: "rgba(245,245,245,0.65)" },
  error: { color: "var(--accent)" },
};
