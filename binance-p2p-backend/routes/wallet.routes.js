const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, walletController.getWallets);
router.get('/:id', auth, walletController.getWalletById);
router.get('/coin/:coinId', auth, walletController.getWalletByCoin);
router.post('/', auth, walletController.createWallet); // ✅ ADD THIS

module.exports = router;