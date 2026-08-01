const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(notFoundHandler);
app.use(errorHandler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;