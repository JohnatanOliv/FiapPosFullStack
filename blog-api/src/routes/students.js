const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { withRoleScope } = require('../middleware/roleScope');
const {
  createUserByAdmin,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');

router.use(requireAuth, requireRole('teacher'), withRoleScope('student'));

router.get('/', listUsers);
router.post('/', createUserByAdmin);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
