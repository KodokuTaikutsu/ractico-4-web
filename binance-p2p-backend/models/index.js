const Sequelize = require('sequelize');
const sequelize = require('../config/database');


const db = {};

db.sequelize = sequelize;

// Load models
db.User = require('./user.model')(sequelize);
db.Coin = require('./coin.model')(sequelize);
db.Wallet = require('./wallet.model')(sequelize);
db.Transaction = require('./transaction.model')(sequelize);
db.Ad = require('./ad.model')(sequelize);

// Define associations
db.User.hasMany(db.Wallet, { foreignKey: 'userId' });
db.Wallet.belongsTo(db.User, { foreignKey: 'userId' });

db.Coin.hasMany(db.Wallet, { foreignKey: 'coinId' });
db.Wallet.belongsTo(db.Coin, { foreignKey: 'coinId' });

// Wallets in transaction
db.Wallet.hasMany(db.Transaction, { foreignKey: 'fromWalletId', as: 'sentTransactions' });
db.Wallet.hasMany(db.Transaction, { foreignKey: 'toWalletId', as: 'receivedTransactions' });
db.Transaction.belongsTo(db.Wallet, { foreignKey: 'fromWalletId', as: 'fromWallet' });
db.Transaction.belongsTo(db.Wallet, { foreignKey: 'toWalletId', as: 'toWallet' });

db.User.hasMany(db.Ad);
db.Ad.belongsTo(db.User);
db.Coin.hasMany(db.Ad);
db.Ad.belongsTo(db.Coin);



module.exports = db;
