'use strict';

const responseMessage = require('../utils/responseMessage');
// Require the Cloudinary library
const cloudinary = require('cloudinary').v2;

module.exports = {
  localFileUpload: (req, callback) => {
    const response = new responseMessage.GenericSuccessMessage();
    response.data = { filename: req.file.filename, file: req.file };
    return callback(null, response, response.code);
  },

  cloudImageUpload: async (req, callback) => {
    let response;
    if (!req.file) {
      response = responseMessage.incorrectPayload;
      return callback(null, response, response.code);
    }
    const path = req.file.path;
    try {
      const res = await cloudinary.uploader.upload(path, {
        folder: 'images',
        resource_type: 'image',
      });
      console.log(res);
      response = new responseMessage.GenericSuccessMessage();
      response.media = {
        publicId: res.public_id,
        url: res.secure_url,
      };
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR in cloudinary upload service', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },
};
