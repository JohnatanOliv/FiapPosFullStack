const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

const request = async (path, { method = 'GET', body, token } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : {};

  if (!response.ok) throw new Error(data.message || 'Erro na API.');
  return data;
};

export const api = {
  loginUser: (email, password) => request('/users/login', { method: 'POST', body: { email, password } }),
  listPosts: () => request('/posts'),
  searchPosts: (q) => request(`/posts/search?q=${encodeURIComponent(q)}`),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (payload, token) => request('/posts', { method: 'POST', body: payload, token }),
  updatePost: (id, payload, token) => request(`/posts/${id}`, { method: 'PUT', body: payload, token }),
  deletePost: (id, token) => request(`/posts/${id}`, { method: 'DELETE', token }),

  listTeachers: (token, page = 1, q = '') =>
    request(`/teachers?page=${page}&limit=10&q=${encodeURIComponent(q)}`, { token }),
  createTeacher: (payload, token) => request('/teachers', { method: 'POST', body: payload, token }),
  updateTeacher: (id, payload, token) => request(`/teachers/${id}`, { method: 'PUT', body: payload, token }),
  deleteTeacher: (id, token) => request(`/teachers/${id}`, { method: 'DELETE', token }),

  listStudents: (token, page = 1, q = '') =>
    request(`/students?page=${page}&limit=10&q=${encodeURIComponent(q)}`, { token }),
  createStudent: (payload, token) => request('/students', { method: 'POST', body: payload, token }),
  updateStudent: (id, payload, token) => request(`/students/${id}`, { method: 'PUT', body: payload, token }),
  deleteStudent: (id, token) => request(`/students/${id}`, { method: 'DELETE', token }),
};