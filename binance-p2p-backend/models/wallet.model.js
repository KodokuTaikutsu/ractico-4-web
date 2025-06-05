const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wallet = sequelize.define('Wallet', {
    balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  });

  return Wallet;
};
