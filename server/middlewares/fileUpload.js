'use strict';
const multer = require('multer');
const commonConfig = require('../commonConfig.json');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  multerSingleUpload: (req, res, next) => {
    // const flowType = req.query.ft || req.body.flowType;
    const fileStorage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, './uploadFile');
      },
      filename: (req, file, callback) => {
        callback(null, file.originalname);
      },
    });

    const upload = multer({
      storage: fileStorage,
    }).single(commonConfig.fileUploadFieldName);

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        // console.log(err);
        console.log(
          'Error ::: Multer related error encounter uploading process failed with error: ',
          JSON.stringify(err)
        );
        const response = responseMessage.fileUploadFailed;
        return res.status(response.code).send(response);
      } else if (err) {
        console.log(
          'Error ::: file uploading process failed with error: ',
          JSON.stringify(err)
        );
        const response = responseMessage.fileUploadFailed;
        return res.status(response.code).send(response);
      } else {
        next();
      }
    });
  },
};
