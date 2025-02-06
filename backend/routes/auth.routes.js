const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// GET route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

router.post('/register', register);
router.post('/login', login);

module.exports = router; 