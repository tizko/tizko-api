const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const Role = require('../utils/role');
const advancedResults = require('../middlewares/advancedResults');
const db = require('../utils/db.connection');
const { createSchema, updateSchema } = require('../validations/user.validation');
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user');

const User = db.User;

//routes
router.route('/')
  .post(authorize(Role.SuperAdmin), createSchema, createUser) // create user route for SuperAdmins
  .get(authorize(Role.SuperAdmin), advancedResults(User), getUsers); // indexing all user accounts is only authorized for SuperAdmin users
router.route('/:id')
  .get(authorize(), getUser)
  .put(authorize(), updateSchema, updateUser)
  .delete(authorize(), deleteUser);

module.exports = router;
