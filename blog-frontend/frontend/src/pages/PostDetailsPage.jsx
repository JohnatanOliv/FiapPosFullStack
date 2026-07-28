import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { UserContext } from "../context/UserContextValue";

export default function PostDetailsPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate(-1)}>← Voltar</button>

        {loading ? (
          <p style={styles.muted}>Carregando...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <>
            <h1 style={styles.title}>{post?.title}</h1>
            <p style={styles.meta}>
              Por {post?.author} • {new Date(post?.createdAt).toLocaleDateString("pt-BR")}
            </p>
            <article style={styles.content}>{post?.content}</article>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Comentários</h2>
              {!user && (
                <p style={styles.muted}>
                  Para comentar, faça login:
                  {" "}
                  <Link to="/student-login">Aluno</Link>
                  {" "}
                  ou
                  {" "}
                  <Link to="/professor-login">Professor</Link>.
                </p>
              )}
              <form onSubmit={handleCreateComment} style={styles.form}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  style={styles.textarea}
                  disabled={!user}
                />
                <button type="submit" style={styles.button} disabled={!user}>
                  Comentar
                </button>
              </form>

              {comments.length === 0 ? (
                <p style={styles.muted}>Ainda não há comentários.</p>
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
                        <button style={styles.deleteBtn} onClick={() => handleDeleteComment(comment.id)}>
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
  wrapper: { minHeight: "100vh", background: "var(--bg)", padding: "16px" },
  container: { maxWidth: "900px", margin: "0 auto", color: "var(--ink)" },
  back: {
    background: "transparent",
    color: "var(--ink-muted)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px 12px",
    cursor: "pointer",
  },
  title: { marginTop: "20px", marginBottom: "8px" },
  meta: { color: "var(--ink-muted)", marginBottom: "20px" },
  content: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
  },
  section: { marginTop: "24px" },
  sectionTitle: { marginBottom: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" },
  textarea: {
    minHeight: "100px",
    background: "var(--surface)",
    color: "var(--ink)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "10px",
  },
  button: {
    alignSelf: "flex-start",
    background: "var(--ink)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius)",
    padding: "10px 14px",
    cursor: "pointer",
  },
  comment: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    background: "var(--surface)",
    padding: "12px",
    marginBottom: "10px",
  },
  commentMeta: { margin: 0, color: "var(--ink-muted)", fontSize: "12px" },
  commentContent: { margin: "8px 0 0" },
  deleteBtn: {
    marginTop: "10px",
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--ink-muted)",
    borderRadius: "var(--radius)",
    padding: "6px 10px",
    cursor: "pointer",
  },
  muted: { color: "var(--ink-muted)" },
  error: { color: "var(--accent)" },
};
