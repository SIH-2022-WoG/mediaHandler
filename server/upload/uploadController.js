'use strict';

const responseHelper = require('../utils/responseHelper');
const uploadService = require('./uploadService');

module.exports = {
  uploadFile: (req, res) => {
    uploadService.localFileUpload(req, (err, data, statusCode) => {
      return responseHelper(err, res, data, statusCode);
    });
  },

  uploadImage: (req, res) => {
    uploadService.localFileUpload(req, (err, localdata, statusCode) => {
      if (statusCode === 200) {
        uploadService.cloudImageUpload(req, (err, imgdata, statusCode) => {
          return responseHelper(err, res, imgdata, statusCode);
        });
      } else {
        return responseHelper(err, res, localdata, statusCode);
      }
    });
  },
};