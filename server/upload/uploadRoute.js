'use strict';

const express = require('express');
const uploadController = require('./uploadController');
const uploadRouter = express.Router();
// const mimeType = require('./modules/mimeType');

uploadRouter.post('/local', (req, res, next) => {
  uploadController.uploadFile(req, res);
});

uploadRouter.post('/cloud/image', (req, res, next) => {
  uploadController.uploadImage(req, res);
});

uploadRouter.post('/cloud/pdf', (req, res, next) => {
  uploadController.uploadPdf(req, res);
});

uploadRouter.get('/textExtract', (req, res, next) => {
  uploadController.textExtract(req, res);
});

module.exports = {
  uploadRouter,
};
