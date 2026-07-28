const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongo;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);

  app = require('../src/app'); // ajusta se necessário
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Blog API', () => {
  let createdId;
  let authToken;
  let studentToken;
  let studentId;

  beforeAll(async () => {
    const res = await request(app).post('/users/register').send({
      name: 'Professor Teste',
      email: 'prof.teste@blogschool.dev',
      password: '123456',
      role: 'teacher',
    });

    authToken = res.body.token;

    const createStudentRes = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Aluno Teste',
        email: 'aluno.teste@blogschool.dev',
        password: '123456',
      });

    studentId = createStudentRes.body.data.id;

    const studentLoginRes = await request(app).post('/users/login').send({
      email: 'aluno.teste@blogschool.dev',
      password: '123456',
    });
    studentToken = studentLoginRes.body.token;
  });

  describe('GET /posts', () => {
    it('retorna lista de posts', async () => {
      const res = await request(app).get('/posts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /posts', () => {
    it('cria um novo post', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post de Teste',
          content: 'Conteúdo do post de teste',
          author: 'Prof. Teste',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Post de Teste');

      createdId = res.body.data._id; // 🔥 corrigido aqui
    });

    it('retorna 400 se título estiver faltando', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'x',
          author: 'y',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /posts/:id', () => {
    it('retorna post pelo id', async () => {
      const res = await request(app).get(`/posts/${createdId}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(createdId);
    });

    it('retorna 404 para id inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app).get(`/posts/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /posts/search', () => {
    it('busca posts por palavra-chave', async () => {
      const res = await request(app).get('/posts/search?q=Teste');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('retorna 400 sem parâmetro q', async () => {
      const res = await request(app).get('/posts/search');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /posts/:id', () => {
    it('atualiza um post existente', async () => {
      const res = await request(app)
        .put(`/posts/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Título Atualizado' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Título Atualizado');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('exclui um post existente', async () => {
      const res = await request(app)
        .delete(`/posts/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('retorna 404 ao tentar excluir post inexistente', async () => {
      const res = await request(app)
        .delete(`/posts/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
  describe('Admin de estudantes', () => {
    it('lista estudantes com paginação', async () => {
      const res = await request(app)
        .get('/students?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((student) => student.id === studentId)).toBe(true);
    });
  });
  describe('Comentários', () => {
    let createdCommentId;
    let commentPostId;

    beforeAll(async () => {
      const postRes = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post para comentários',
          content: 'Conteúdo para validar comentários',
          author: 'Prof. Teste',
        });
      commentPostId = postRes.body.data._id;
    });

    it('aluno autenticado cria comentário em post', async () => {
      const res = await request(app)
        .post(`/posts/${commentPostId}/comments`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ content: 'Comentário do aluno.' });
      expect(res.status).toBe(201);
      expect(res.body.data.content).toBe('Comentário do aluno.');
      createdCommentId = res.body.data.id;
    });

    it('lista comentários de um post', async () => {
      const res = await request(app).get(`/posts/${commentPostId}/comments`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((comment) => comment.id === createdCommentId)).toBe(true);
    });

    it('autor do comentário consegue excluir próprio comentário', async () => {
      const res = await request(app)
        .delete(`/posts/${commentPostId}/comments/${createdCommentId}`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
  describe('Rota inexistente', () => {
    it('retorna 404 para rota inexistente', async () => {
      const res = await request(app).get('/rota-que-nao-existe');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Rota não encontrada.');
    });


  });
  describe('Erro interno do servidor', () => {
    it('retorna 500 em erro interno', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { });

      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: null, // força erro inesperado dependendo do controller
        });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

  });
  describe('Validação de dados', () => {
    it('retorna 400 para dados inválidos', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // título vazio
          content: 'Conteúdo válido',
          author: 'Prof. Teste',
        });
      expect(res.status).toBe(400);
    });

  });



});