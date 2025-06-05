const { Transaction, Ad, Wallet, Coin } = require('../models');
const { Op } = require('sequelize');

// Get transactions for a wallet
exports.getWalletTransactions = async (req, res) => {
  const { walletId } = req.params;

  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { fromWalletId: walletId },
          { toWalletId: walletId }
        ]
      },
      include: ['fromWallet', 'toWallet']
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startTransaction = async (req, res) => {
  const { adId, amount, toWalletId } = req.body;

  try {
    const ad = await Ad.findByPk(adId, { include: ['User', 'Coin'] });
    if (!ad || ad.status !== 'open') {
      return res.status(404).json({ message: 'Ad not available' });
    }

    const totalUSD = amount * ad.pricePerUnit;

    let fromWallet, toWallet, type;

    // Determine transaction direction
    if (ad.type === 'sell') {
      // Buyer is current user (you), seller is ad.User
      fromWallet = await Wallet.findOne({
        where: {
          userId: ad.UserId,
          coinId: ad.CoinId
        }
      });

      toWallet = await Wallet.findByPk(toWalletId);
      type = 'buy';
    } else {
      // Seller is current user (you), buyer is ad.User
      fromWallet = await Wallet.findByPk(toWalletId);
      toWallet = await Wallet.findOne({
        where: {
          userId: ad.UserId,
          coinId: ad.CoinId
        }
      });
      type = 'sell';
    }

    if (!fromWallet || !toWallet) {
      return res.status(400).json({ message: 'One of the wallets was not found' });
    }

    // Ensure buyer has enough money (if needed, optional)
    if (type === 'sell' && fromWallet.balance < totalUSD) {
      return res.status(400).json({ message: 'Insufficient funds in your wallet' });
    }

    const transaction = await Transaction.create({
      type,
      amount: totalUSD,
      fromWalletId: fromWallet.id,
      toWalletId: toWallet.id,
      status: 'pending'
    });

    ad.status = 'matched';
    await ad.save();

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Start transaction error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.uploadProof = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status !== 'pending') return res.status(400).json({ message: 'Transaction not in pending state' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    transaction.proofImage = req.file.filename;
    await transaction.save();

    res.json({ message: 'Proof uploaded', proof: transaction.proofImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.completeTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const tx = await Transaction.findByPk(id);
    if (!tx || tx.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction not found or already processed' });
    }

    const fromWallet = await Wallet.findByPk(tx.fromWalletId);
    const toWallet = await Wallet.findByPk(tx.toWalletId);

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ message: 'One or both wallets not found' });
    }

    if (fromWallet.balance < tx.amount) {
      return res.status(400).json({ message: 'Insufficient funds in sender wallet' });
    }

    // Transfer funds
    fromWallet.balance -= tx.amount;
    toWallet.balance += tx.amount;

    await fromWallet.save();
    await toWallet.save();

    tx.status = 'completed';
    await tx.save();

    res.json({ message: 'Transaction completed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const tx = await Transaction.findByPk(id);
    if (!tx || tx.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction not found or already processed' });
    }

    tx.status = 'cancelled';
    await tx.save();

    res.json({ message: 'Transaction cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.transferFunds = async (req, res) => {
  const { fromWalletId, toWalletId, amount } = req.body;

  try {
    const fromWallet = await Wallet.findByPk(fromWalletId, { include: Coin });
    const toWallet = await Wallet.findByPk(toWalletId, { include: Coin });

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (fromWallet.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not own the source wallet' });
    }

    if (fromWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Currency conversion: from -> USD -> to
    const amountInUSD = amount * fromWallet.Coin.valueInUSD;
    const convertedAmount = amountInUSD / toWallet.Coin.valueInUSD;

    // Update balances
    fromWallet.balance -= amount;
    toWallet.balance += convertedAmount;

    await fromWallet.save();
    await toWallet.save();

    // Record transaction
    const tx = await Transaction.create({
      type: 'transfer',
      amount: amountInUSD, // stored in USD
      fromWalletId,
      toWalletId,
      status: 'completed'
    });

    res.status(201).json({ message: 'Transfer successful', transaction: tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/transaction.controller.js
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};