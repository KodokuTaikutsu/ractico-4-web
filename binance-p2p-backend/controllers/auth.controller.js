const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
        email: user.email,
        id: user.id
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};
