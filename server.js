require('rootpath')();
require('dotenv-safe').config();
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const app = express();
const cors = require('cors');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error-handler');

// dotenv.config({ path: './config/config.env' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//api routes
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/stores', require('./routes/stores'));

//swagger docs route
app.use('/docs', require('utils/swagger'));

//global error handler passed as a middleware
app.use(errorHandler);

// const port =
//   process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 5000;
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});