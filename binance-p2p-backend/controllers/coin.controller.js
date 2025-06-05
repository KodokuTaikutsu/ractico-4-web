const { Coin } = require('../models');

exports.getCoins = async (req, res) => {
  try {
    const coins = await Coin.findAll();
    res.json(coins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
