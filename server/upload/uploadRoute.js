'use strict';

const express = require('express');
const uploadController = require('./uploadController');
const uploadRouter = express.Router();

uploadRouter.post('/local', (req, res, next) => {
  uploadController.uploadFile(req, res);
});

module.exports = {
  uploadRouter,
};
