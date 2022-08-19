'use strict';

const responseMessage = require('../utils/responseMessage');

module.exports = {
  localFileUpload: (req, callback) => {
    const response = new responseMessage.GenericSuccessMessage();
    response.data = { filename: req.file.filename };
    return callback(null, response, response.code);
  },
};
