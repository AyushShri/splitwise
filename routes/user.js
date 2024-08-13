const express = require('express');
const router = express.Router();
const { createUser, getUserById } = require('../controllers/userController');

router.post('/user', createUser);
router.get('/user/:id', getUserById);

module.exports = router;