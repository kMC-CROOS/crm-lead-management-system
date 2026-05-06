const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const TEST_USER = {
  email: 'admin@example.com',
  passwordHash: bcrypt.hashSync('password123', 10),
  name: 'CRM Admin',
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (email !== TEST_USER.email) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, TEST_USER.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { email: TEST_USER.email, name: TEST_USER.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, user: { email: TEST_USER.email, name: TEST_USER.name } });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

module.exports = router;
