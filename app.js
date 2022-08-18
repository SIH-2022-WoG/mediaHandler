'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { promisify } = require('util');
const app = (module.exports = express());

// dont add any config before this line
dotenv.config({ path: './config/.env' });
// Setting global variables, Please don't move this. Please add dependency after this line
require('./config/globalConstant');

// body and cookie parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
// app.use(expressValidator());

// Compress all routes and the response.
app.use(compression());

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());
global.applicationRootPath = path.resolve(__dirname);

app.use('/', express.static(path.join(__dirname, 'public')));

// cors policy set to all
app.options('*', cors());
app.use(cors());
app.use(morgan('dev'));

// routes
require('./routes')(app);

// error handling and dev settings

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    return res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  next(err);
});

/** */
