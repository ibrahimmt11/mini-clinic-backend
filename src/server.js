require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const { Sequelize } = require('sequelize');
const config = require('./config/config.js')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch((err) => console.error('DB connection failed:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});