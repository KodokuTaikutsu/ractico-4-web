require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log('DB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
