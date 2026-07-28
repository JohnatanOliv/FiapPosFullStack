import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { UserContext } from "../../context/UserContextValue";
import PostCard from "../../components/PostCard/PostCard";
import "../professor/Dashboard.css";

export default function StudentDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const loadPosts = async ({ resetLoading } = { resetLoading: true }) => {
    if (resetLoading) {
      setLoading(true);
    }
    setError("");
    try {
      const data = await api.listPosts();
      setPosts(data.data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      if (resetLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let active = true;

    const fetchInitialPosts = async () => {
      try {
        const data = await api.listPosts();
        if (!active) return;
        setPosts(data.data.data);
      } catch (e) {
        if (!active) return;
        setError(e.message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchInitialPosts();

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { loadPosts(); return; }
    setSearching(true);
    setError("");
    try {
      const data = await api.searchPosts(search);
      setPosts(data.data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    loadPosts();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dash-root student-theme">
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-brand">
            <span className="dash-logo">✏️</span>
            <span className="dash-title">BlogSchool</span>
          </div>
          <div className="dash-user">
            <span className="user-badge student">🎒 {user?.name || "Aluno"}</span>
            <button className="logout-btn" onClick={handleLogout}>Voltar</button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-hero">
          <h2 className="dash-welcome">Bem-vindo ao Blog! 👋</h2>
          <p className="dash-welcome-sub">Explore os posts do blog da sua turma.</p>
          <p className="dash-welcome-sub" style={{ marginTop: 8 }}>
            Comentários disponíveis na leitura completa do post.
          </p>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por título, conteúdo ou autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="search-clear" onClick={clearSearch}>✕</button>
          )}
          <button type="submit" className="search-btn" disabled={searching}>
            {searching ? "..." : "Buscar"}
          </button>
        </form>

        {error && <div className="dash-error">{error}</div>}

        {loading ? (
          <div className="dash-loading">
            <div className="loader"></div>
            <span>Carregando posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="dash-empty">
            <span>📭</span>
            <p>Nenhum post encontrado.</p>
            {search && <button onClick={clearSearch} className="link-btn">Ver todos os posts</button>}
          </div>
        ) : (
          <>
            <p className="post-count">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onClick={() => navigate(`/posts/${post._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <div style={{ padding: "0 24px 24px", color: "var(--ink-muted)" }}>
        <Link to="/" style={{ color: "var(--accent)" }}>Voltar ao início</Link>
      </div>
    </div>
  );
}
