const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    type: {
      type: DataTypes.ENUM('buy', 'sell', 'transfer'),
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    proofImage: {
      type: DataTypes.STRING, // image filename
      allowNull: true
    }
  });

  return Transaction;
};
