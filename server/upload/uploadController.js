'use strict';
const fs = require('fs');
const path = require('path');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');
const uploadService = require('./uploadService');

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
    const filesPath = '../../uploadFile';
    const randomText = makeid(5);
    const filename = req.query.fn.slice(0, -4) + randomText + '.txt';
    const filePath = path.resolve(__dirname, filesPath, filename);

    try {
      const result = await Promise.all(promises);
      response = new responseMessage.GenericSuccessMessage();
      result.forEach((el) => {
        fs.appendFileSync(filePath, el[0]);
      });
      response.path = filename;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log('error ::: ', err);
    }
  },
};
