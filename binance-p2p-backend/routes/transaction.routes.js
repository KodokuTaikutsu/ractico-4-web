const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/wallet/:walletId', auth, transactionController.getWalletTransactions);
router.post('/start', auth, transactionController.startTransaction);
router.post('/upload-proof/:transactionId', auth, upload.single('image'), transactionController.uploadProof);
router.post('/complete/:id', auth, transactionController.completeTransaction);
router.post('/cancel/:id', auth, transactionController.cancelTransaction);
router.post('/transfer', auth, transactionController.transferFunds);




module.exports = router;
