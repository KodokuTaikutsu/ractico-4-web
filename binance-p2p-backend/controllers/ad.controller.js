const { Ad, Coin } = require('../models');

// List ads by coin and type
exports.listAds = async (req, res) => {
  const { coin, type } = req.query;

  const where = {};
  if (type) where.type = type;
  if (coin) where.coinId = coin;

  const ads = await Ad.findAll({ where, include: [Coin, 'User'] });
  res.json(ads);
};

// Create new ad
exports.createAd = async (req, res) => {
  const { type, pricePerUnit, quantity, coinId, paymentInstructions } = req.body;
  const paymentImage = req.file ? req.file.filename : null;

  try {
    const ad = await Ad.create({
        userId: req.user.id,
        coinId,
        type,
        pricePerUnit,
        quantity,
        paymentInstructions,
        status: 'open'
    });

    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id, {
      include: ['Coin', 'User']
    });
    if (!ad) return res.status(404).json({ message: 'Ad not found' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
