'use strict';

const { multerSingleUpload } = require('./server/middlewares/fileUpload');
const { uploadRouter } = require('./server/upload/uploadRoute');
/**health check route */
const healthCheck = require('./server/utils/healthCheck');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);
  app.use('/fileupload', [multerSingleUpload], uploadRouter);
};
