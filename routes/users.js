const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const Role = require('../utils/role');
const { createSchema, updateSchema } = require('../validations/user.validation');
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user');

//routes
router.route('/')
  .post(authorize(Role.SuperAdmin), createSchema, createUser) // create user route for SuperAdmins
  .get(authorize(Role.SuperAdmin), getUsers); // indexing all user accounts is only authorized for SuperAdmin users
router.route('/:id')
  .get(authorize(), getUser)
  .put(authorize(), updateSchema, updateUser)
  .delete(authorize(), deleteUser);

module.exports = router;
