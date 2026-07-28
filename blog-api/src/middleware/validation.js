const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateCreate = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório.'),
  body('content').trim().notEmpty().withMessage('Conteúdo é obrigatório.'),
  body('author').trim().notEmpty().withMessage('Autor é obrigatório.'),
  handleValidation,
];

const validateUpdate = [
  body('title').optional().trim().notEmpty().withMessage('Título não pode ser vazio.'),
  body('content').optional().trim().notEmpty().withMessage('Conteúdo não pode ser vazio.'),
  body('author').optional().trim().notEmpty().withMessage('Autor não pode ser vazio.'),
  handleValidation,
];

const validateCommentCreate = [
  body('content').trim().notEmpty().withMessage('Conteúdo do comentário é obrigatório.'),
  handleValidation,
];

const validateCommentUpdate = [
  body('content').trim().notEmpty().withMessage('Conteúdo do comentário é obrigatório.'),
  handleValidation,
];

module.exports = {
  validateCreate,
  validateUpdate,
  validateCommentCreate,
  validateCommentUpdate,
};
