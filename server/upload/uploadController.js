'use strict';

const responseHelper = require('../utils/responseHelper');
const uploadService = require('./uploadService');

module.exports = {
  uploadFile: (req, res) => {
    uploadService.localFileUpload(req, (err, data, statusCode) => {
      return responseHelper(err, res, data, statusCode);
    });
  },
};
