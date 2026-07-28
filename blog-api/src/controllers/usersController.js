const bcrypt = require('bcryptjs');
const User = require('../models/userStore');
const { issueAuthToken } = require('../middleware/auth');

const ALLOWED_ROLES = new Set(['teacher', 'student']);

const normalizeRole = (role) => {
  if (!role) return 'teacher';
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

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = normalizeRole(req.body.role);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios.',
      });
    }

    if (!ALLOWED_ROLES.has(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role inválido. Use "teacher" ou "student".',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    const token = issueAuthToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso.',
      token,
      data: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos.',
      });
    }

    const token = issueAuthToken(user);

    res.json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
      data: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const listUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const role = req.query.role ? normalizeRole(req.query.role) : null;
    const q = req.query.q ? String(req.query.q).trim() : '';

    if (role && !ALLOWED_ROLES.has(role)) {
      return res.status(400).json({
        success: false,
        message: 'Filtro role inválido. Use "teacher" ou "student".',
      });
    }

    const filter = {};
    if (role === 'teacher') {
      filter.$or = [{ role: 'teacher' }, { role: { $exists: false } }];
    } else if (role) {
      filter.role = role;
    }
    if (q) {
      const regex = new RegExp(q, 'i');
      const textFilter = [{ name: regex }, { email: regex }];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: textFilter }];
        delete filter.$or;
      } else {
        filter.$or = textFilter;
      }
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
    const user = await User.findById(req.params.id);
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
      const role = normalizeRole(req.body.role);
      if (!ALLOWED_ROLES.has(role)) {
        return res.status(400).json({
          success: false,
          message: 'Role inválido. Use "teacher" ou "student".',
        });
      }
      updates.role = role;
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

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
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
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    return res.json({ success: true, message: 'Usuário excluído com sucesso.' });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }
};

module.exports = { register, login, listUsers, getUser, updateUser, deleteUser };