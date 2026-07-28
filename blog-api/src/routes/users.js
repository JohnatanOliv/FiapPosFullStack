const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const {
    register,
    login,
    createUserByAdmin,
    listUsers,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/usersController');

router.post('/register', register);
router.post('/login', login);
router.post('/', requireAuth, requireRole('teacher'), createUserByAdmin);
router.get('/', requireAuth, requireRole('teacher'), listUsers);
router.get('/:id', requireAuth, requireRole('teacher'), getUser);
router.put('/:id', requireAuth, requireRole('teacher'), updateUser);
router.delete('/:id', requireAuth, requireRole('teacher'), deleteUser);

module.exports = router;
