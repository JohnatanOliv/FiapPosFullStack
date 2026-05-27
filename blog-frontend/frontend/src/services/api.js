import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Posts
  listPosts: () => instance.get("/posts"),
  searchPosts: (query) => instance.get("/posts/search", { params: { q: query } }),
  createPost: (data) => instance.post("/posts", data),
  updatePost: (id, data) => instance.put(`/posts/${id}`, data),
  deletePost: (id) => instance.delete(`/posts/${id}`),

  // Users
  registerUser: (name, email, password) => instance.post("/users/register", { name, email, password }),
  loginUser: (email, password) => instance.post("/users/login", { email, password }),
};