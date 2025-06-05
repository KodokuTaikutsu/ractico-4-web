const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

//middleware
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/wallets', require('./routes/wallet.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/ads', require('./routes/ad.routes'));
app.use('/api/coins', require('./routes/coin.routes'));

app.get('/', (req, res) => {
  res.send('Binance P2P API Running');
});

module.exports = app;
