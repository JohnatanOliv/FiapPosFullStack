const Post = require('../models/postStore');
const User = require('../models/userStore');
const Comment = require('../models/commentStore');

const sanitizeComment = (comment) => ({
  id: comment._id,
  postId: comment.postId,
  authorId: comment.authorId,
  authorName: comment.authorName,
  authorRole: comment.authorRole,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

const listCommentsByPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado.' });
    }

    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: 1 });
    return res.json({ success: true, count: comments.length, data: comments.map(sanitizeComment) });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }
};

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post não encontrado.' });
    }

    const author = await User.findById(req.auth.id);
    if (!author) {
      return res.status(401).json({ success: false, message: 'Usuário autenticado não encontrado.' });
    }

    const comment = await Comment.create({
      postId: post._id,
      authorId: author._id,
      authorName: author.name,
      authorRole: author.role || 'teacher',
      content: req.body.content,
    });

    return res.status(201).json({ success: true, data: sanitizeComment(comment) });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, postId: req.params.id });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentário não encontrado.' });
    }

    const isTeacher = req.auth.role === 'teacher';
    const isAuthor = String(comment.authorId) === String(req.auth.id);
    if (!isTeacher && !isAuthor) {
      return res.status(403).json({ success: false, message: 'Sem permissão para editar este comentário.' });
    }

    comment.content = req.body.content;
    await comment.save();

    return res.json({ success: true, data: sanitizeComment(comment) });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentId, postId: req.params.id });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentário não encontrado.' });
    }

    const isTeacher = req.auth.role === 'teacher';
    const isAuthor = String(comment.authorId) === String(req.auth.id);
    if (!isTeacher && !isAuthor) {
      return res.status(403).json({ success: false, message: 'Sem permissão para excluir este comentário.' });
    }

    await Comment.deleteOne({ _id: comment._id });
    return res.json({ success: true, message: 'Comentário excluído com sucesso.' });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  listCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
