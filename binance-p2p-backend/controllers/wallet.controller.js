const { Wallet, Transaction, Coin } = require('../models');

// Get all wallets for the logged-in user
exports.getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.findAll({ where: { userId: req.user.id } });
    res.json(wallets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific wallet by ID with its transactions
exports.getWalletById = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: Transaction,
          as: 'sentTransactions',
          include: ['toWallet']
        },
        {
          model: Transaction,
          as: 'receivedTransactions',
          include: ['fromWallet']
        },
        Coin
      ]
    });

    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a wallet by coin ID, with transactions and coin info
exports.getWalletByCoin = async (req, res) => {
  const { coinId } = req.params;

  try {
    const wallet = await Wallet.findOne({
      where: { userId: req.user.id, coinId },
      include: [
        Coin,
        {
          model: Transaction,
          as: 'sentTransactions',
          include: ['toWallet']
        },
        {
          model: Transaction,
          as: 'receivedTransactions',
          include: ['fromWallet']
        }
      ]
    });

    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createWallet = async (req, res) => {
  const { coinId, balance } = req.body;
  try {
    const wallet = await Wallet.create({
      userId: req.user.id,
      coinId,
      balance: balance || 0
    });
    res.status(201).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};