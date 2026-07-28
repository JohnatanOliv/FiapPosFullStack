import axios from "axios";

const AUTH_TOKEN_STORAGE_KEY = "authToken";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Posts
  listPosts: () => instance.get("/posts"),
  getPost: (id) => instance.get(`/posts/${id}`),
  searchPosts: (query) => instance.get("/posts/search", { params: { q: query } }),
  createPost: (data) => instance.post("/posts", data),
  updatePost: (id, data) => instance.put(`/posts/${id}`, data),
  deletePost: (id) => instance.delete(`/posts/${id}`),
  listComments: (postId) => instance.get(`/posts/${postId}/comments`),
  createComment: (postId, content) => instance.post(`/posts/${postId}/comments`, { content }),
  updateComment: (postId, commentId, content) =>
    instance.put(`/posts/${postId}/comments/${commentId}`, { content }),
  deleteComment: (postId, commentId) => instance.delete(`/posts/${postId}/comments/${commentId}`),

  // Users
  registerUser: (name, email, password, role = "teacher") =>
    instance.post("/users/register", { name, email, password, role }),
  loginUser: (email, password) => instance.post("/users/login", { email, password }),
  listTeachers: ({ page = 1, limit = 10, q = "" } = {}) =>
    instance.get("/teachers", { params: { page, limit, q } }),
  createTeacher: ({ name, email, password }) => instance.post("/teachers", { name, email, password }),
  updateTeacher: (id, payload) => instance.put(`/teachers/${id}`, payload),
  deleteTeacher: (id) => instance.delete(`/teachers/${id}`),
  listStudents: ({ page = 1, limit = 10, q = "" } = {}) =>
    instance.get("/students", { params: { page, limit, q } }),
  createStudent: ({ name, email, password }) => instance.post("/students", { name, email, password }),
  updateStudent: (id, payload) => instance.put(`/students/${id}`, payload),
  deleteStudent: (id) => instance.delete(`/students/${id}`),
};