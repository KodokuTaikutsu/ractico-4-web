const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ad = sequelize.define('Ad', {
    type: {
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false
    },
    pricePerUnit: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    paymentInstructions: {
      type: DataTypes.TEXT, // or file path if using image
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'matched', 'closed'),
      defaultValue: 'open'
    },
    paymentImage: {
        type: DataTypes.STRING, // stored as filename
        allowNull: true
    }

  });

  return Ad;
};
