const { Coin, User } = require('../models');

// Create coin
exports.createCoin = async (req, res) => {
  const { name, valueInUSD } = req.body;
  try {
    const coin = await Coin.create({ name, valueInUSD });
    res.status(201).json(coin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all coins
exports.getAllCoins = async (req, res) => {
  try {
    const coins = await Coin.findAll();
    res.json(coins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update coin
exports.updateCoin = async (req, res) => {
  const { id } = req.params;
  const { name, valueInUSD } = req.body;
  try {
    const coin = await Coin.findByPk(id);
    if (!coin) return res.status(404).json({ message: 'Coin not found' });

    coin.name = name ?? coin.name;
    coin.valueInUSD = valueInUSD ?? coin.valueInUSD;
    await coin.save();

    res.json(coin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete coin
exports.deleteCoin = async (req, res) => {
  const { id } = req.params;
  try {
    const coin = await Coin.findByPk(id);
    if (!coin) return res.status(404).json({ message: 'Coin not found' });

    await coin.destroy();
    res.json({ message: 'Coin deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.promoteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};