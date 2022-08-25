'use strict';

const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');
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

  uploadPdf: (req, res) => {
    uploadService.localFileUpload(req, (err, localdata, statusCode) => {
      if (statusCode === 200) {
        uploadService.cloudPdfUpload(req, (err, pdfdata, statusCode) => {
          return responseHelper(err, res, pdfdata, statusCode);
        });
      } else {
        return responseHelper(err, res, localdata, statusCode);
      }
    });
  },

  textExtract: (req, res) => {
    uploadService.textExtract(req, (err, data, statusCode) => {
      return responseHelper(err, res, data, statusCode);
    });
  },

  uploadThesis: async (req, res) => {
    const pages = Number(req.query.ps);
    const promises = [];
    let response;
    for (let i = 1; i < pages + 1; i++) {
      req.query.pn = Number(i);
      promises.push(uploadService.createTextAsync(req));
    }

    try {
      const result = await Promise.all(promises);
      response = new responseMessage.GenericSuccessMessage();
      response.data = result;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log('error ::: ', err);
    }
  },
};
