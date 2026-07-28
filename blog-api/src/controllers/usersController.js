const bcrypt = require('bcryptjs');
const User = require('../models/userStore');
const { issueAuthToken } = require('../middleware/auth');

const ALLOWED_ROLES = new Set(['teacher', 'student']);

const normalizeRole = (role, fallback = null) => {
  if (role === undefined || role === null || role === '') return fallback;
  return String(role).trim().toLowerCase();
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || 'teacher',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const resolveRoleScope = (req, fallback = null) => {
  if (req.roleScope) return req.roleScope;
  return normalizeRole(req.body.role ?? req.query.role, fallback);
};

const assertValidRole = (role, message = 'Role inválido. Use "teacher" ou "student".') => {
  return role && ALLOWED_ROLES.has(role) ? null : message;
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = resolveRoleScope(req, 'teacher');

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios.',
      });
    }

    const roleError = assertValidRole(role);
    if (roleError) {
      return res.status(400).json({ success: false, message: roleError });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado.',
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role,
    });

    const token = issueAuthToken(user);
    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso.',
      token,
      data: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const role = resolveRoleScope(req, null);
    const roleError = assertValidRole(role);
    if (roleError) {
      return res.status(400).json({ success: false, message: roleError });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios.',
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso.',
      data: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios.',
      });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      });
    }

    const passwordMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      });
    }

    const token = issueAuthToken(user);
    return res.json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
      data: sanitizeUser(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const buildListFilter = (req) => {
  const role = resolveRoleScope(req, null);
  const q = req.query.q ? String(req.query.q).trim() : '';
  const filter = {};

  if (role) {
    const roleError = assertValidRole(role, 'Filtro role inválido. Use "teacher" ou "student".');
    if (roleError) return { error: roleError };
    filter.role = role;
  }

  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return { filter };
};

const listUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const { error, filter } = buildListFilter(req);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return res.json({
      success: true,
      data: users.map(sanitizeUser),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const role = resolveRoleScope(req, null);
    if (role) filter.role = role;

    const user = await User.findOne(filter);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }
    return res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = {};
    const scopedRole = resolveRoleScope(req, null);

    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();
      if (!name) return res.status(400).json({ success: false, message: 'Nome não pode ser vazio.' });
      updates.name = name;
    }

    if (req.body.email !== undefined) {
      const email = String(req.body.email).trim().toLowerCase();
      if (!email) return res.status(400).json({ success: false, message: 'Email não pode ser vazio.' });
      const alreadyExists = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (alreadyExists) {
        return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
      }
      updates.email = email;
    }

    if (req.body.role !== undefined) {
      const nextRole = normalizeRole(req.body.role, null);
      const roleError = assertValidRole(nextRole);
      if (roleError) {
        return res.status(400).json({ success: false, message: roleError });
      }
      if (scopedRole && scopedRole !== nextRole) {
        return res.status(400).json({
          success: false,
          message: `Nesta rota, o papel deve permanecer como "${scopedRole}".`,
        });
      }
      updates.role = nextRole;
    } else if (scopedRole) {
      updates.role = scopedRole;
    }

    if (req.body.password !== undefined) {
      const password = String(req.body.password);
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter no mínimo 6 caracteres.',
        });
      }
      updates.passwordHash = await bcrypt.hash(password, 10);
    }

    const filter = { _id: req.params.id };
    if (scopedRole) filter.role = scopedRole;

    const user = await User.findOneAndUpdate(filter, updates, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    return res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const role = resolveRoleScope(req, null);
    if (role) filter.role = role;

    const user = await User.findOneAndDelete(filter);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    return res.json({ success: true, message: 'Usuário excluído com sucesso.' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }
};

module.exports = {
  register,
  login,
  createUserByAdmin,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};