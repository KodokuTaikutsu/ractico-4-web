const express = require('express');
const router = express.Router();
const { getCoins } = require('../controllers/coin.controller');

router.get('/', getCoins);

module.exports = router;
