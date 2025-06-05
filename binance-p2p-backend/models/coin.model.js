const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coin = sequelize.define('Coin', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    valueInUSD: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  return Coin;
};

