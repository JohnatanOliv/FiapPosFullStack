const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/postsController');
const { validateCreate, validateUpdate } = require('../middleware/validation');
const { requireAuth, requireRole } = require('../middleware/auth');

// IMPORTANT: /search must come before /:id so Express doesn't treat "search" as an id
router.get('/search', ctrl.searchPosts);
router.get('/', ctrl.listPosts);
router.get('/:id', ctrl.getPost);
router.post('/', requireAuth, requireRole('teacher'), validateCreate, ctrl.createPost);
router.put('/:id', requireAuth, requireRole('teacher'), validateUpdate, ctrl.updatePost);
router.delete('/:id', requireAuth, requireRole('teacher'), ctrl.deletePost);

module.exports = router;
