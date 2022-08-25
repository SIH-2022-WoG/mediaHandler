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

  uploadThesis: (req, res) => {
    uploadService.localFileUpload(req, async (err, localdata, statusCode) => {
      if (parseInt(statusCode) === 200) {
        // console.log(localdata);
        const pages = Number(req.query.ps);
        req.query.fn = localdata.data.filename;
        uploadService.cloudPdfUpload(req, async (err, pdfdata, statusCode) => {
          if (parseInt(statusCode) === 200) {
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
              req.file = {
                filename,
                path: filePath,
              };
              uploadService.cloudTextUpload(
                req,
                (err, textdata, statusCode) => {
                  textdata.pdfdata = pdfdata;
                  return responseHelper(err, res, textdata, statusCode);
                }
              );
            } catch (err) {
              console.log('error ::: ', err);
            }
          } else {
            return responseHelper(err, res, pdfdata, statusCode);
          }
        });
      } else {
        return responseHelper(err, res, localdata, statusCode);
      }
    });
  },

  multiLangThesis: (req, res) => {
    uploadService.localFileUpload(req, async (err, localdata, statusCode) => {
      if (parseInt(statusCode) === 200) {
        // console.log(localdata);
        const pages = Number(req.query.ps);
        req.query.fn = localdata.data.filename;
        uploadService.cloudPdfUpload(req, async (err, pdfdata, statusCode) => {
          if (parseInt(statusCode) === 200) {
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
              req.file = {
                filename,
                path: filePath,
              };
              uploadService.cloudTextUpload(
                req,
                (err, textdata, statusCode) => {
                  textdata.pdfdata = pdfdata;
                  return responseHelper(err, res, textdata, statusCode);
                }
              );
            } catch (err) {
              console.log('error ::: ', err);
            }
          } else {
            return responseHelper(err, res, pdfdata, statusCode);
          }
        });
      } else {
        return responseHelper(err, res, localdata, statusCode);
      }
    });
  },

  multiLangExtract: async (req, res) => {
    let response;
    try {
      const data = await uploadService.multiLangExtract(req);
      const filesPath = '../../uploadFile';
      const randomText = makeid(5) + '.txt';
      const filePath = path.resolve(__dirname, filesPath, randomText);
      req.textPath = filePath;
      fs.writeFileSync(filePath, data);
      const cloudData = await uploadService.cloudUploadThesisAsync(req);
      response = new responseMessage.GenericSuccessMessage();
      response.data = cloudData;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(err, res, response, response.code);
    }
  },
};
