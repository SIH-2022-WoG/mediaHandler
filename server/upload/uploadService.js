'use strict';

// Require the Cloudinary library
const cloudinary = require('cloudinary').v2;
const path = require('path');
const { PDFNet } = require('@pdftron/pdfnet-node');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const responseMessage = require('../utils/responseMessage');

function PDFNetEndpoint(main, pathname, callback) {
  let response;
  PDFNet.runWithCleanup(main, process.env.PDF_TRON_TRIAL_KEY) //
    .then(() => {
      PDFNet.shutdown();
      fs.readFile(pathname, (err, data) => {
        if (err) {
          response = new responseMessage.GenericFailureMessage();
          response.message = 'Error getting the file:';
          console.log(err);
          return callback(null, response, response.code);
        } else {
          response = new responseMessage.GenericSuccessMessage();
          return callback(null, response, response.code);
        }
      });
    })
    .catch((err) => {
      response = new responseMessage.GenericFailureMessage();
      console.log('ERROR ::: in pdf tron upload service', err);
      return callback(null, response, response.code);
    });
}

function PDFNetAsyncEndpoint(main) {
  return new Promise(async (resolve, reject) => {
    try {
      await PDFNet.runWithCleanup(main, process.env.PDF_TRON_TRIAL_KEY); //
      resolve('sucess');
    } catch (err) {
      console.log(err);
      reject('error');
    }
  });
}

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

  cloudPdfUpload: async (req, callback) => {
    let response;
    if (!req.file) {
      response = responseMessage.incorrectPayload;
      return callback(null, response, response.code);
    }
    const path = req.file.path;
    try {
      const res = await cloudinary.uploader.upload(path, {
        folder: 'pdfs',
        resource_type: 'auto',
      });
      // console.log(res);
      response = new responseMessage.GenericSuccessMessage();
      response.media = {
        publicId: res.public_id,
        url: res.secure_url,
      };
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR in cloudPdfUpload service', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  cloudTextUpload: async (req, callback) => {
    let response;
    if (!req.file) {
      response = responseMessage.incorrectPayload;
      return callback(null, response, response.code);
    }
    const path = req.file.path;
    try {
      const res = await cloudinary.uploader.upload(path, {
        folder: 'texts',
        resource_type: 'auto',
      });
      // console.log(res);
      response = new responseMessage.GenericSuccessMessage();
      response.media = {
        publicId: res.public_id,
        url: res.secure_url,
      };
      return callback(null, response, response.code);
    } catch (err) {
      console.log('ERROR in cloudPdfUpload service', err);
      response = new responseMessage.GenericFailureMessage();
      return callback(null, response, response.code);
    }
  },

  textExtract: async (req, callback) => {
    const filename = req.query.fn;
    let pageNumber = Number(req.query.pn);
    console.log(filename, pageNumber);
    let ext = path.parse(filename).ext;

    if (ext !== '.pdf') {
      res.statusCode = 500;
      res.end(`File is not a PDF. Please convert it first.`);
    }

    const filesPath = '../../uploadFile';
    const inputPath = path.resolve(__dirname, filesPath, filename);
    const outputPath = path.resolve(
      __dirname,
      filesPath,
      `${filename}-${pageNumber}.txt`
    );
    let response;
    const main = async () => {
      await PDFNet.initialize();
      try {
        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
        await pdfdoc.initSecurityHandler();
        const page = await pdfdoc.getPage(pageNumber);

        if (!page) {
          response = new responseMessage.GenericFailureMessage();
          response.message = 'page number is not valid';
          return callback(null, response, response.code);
        }

        const txt = await PDFNet.TextExtractor.create();
        const rect = new PDFNet.Rect(0, 0, 612, 794);
        txt.begin(page, rect);
        let text;

        text = await txt.getAsText();
        fs.writeFile(outputPath, text, (err) => {
          if (err) {
            console.log(err);
            response = new responseMessage.GenericFailureMessage();
            return callback(null, response, response.code);
          }
        });
      } catch (err) {
        console.log(err);
        response = new responseMessage.GenericFailureMessage();
        return callback(null, response, response.code);
      }
    };

    PDFNetEndpoint(main, outputPath, callback);
  },

  createTextAsync: (req) => {
    return new Promise((resolve, reject) => {
      console.log(
        'Create text async called for....',
        req.query.fn,
        req.query.pn
      );

      const data = [];
      const filename = req.query.fn;
      const pageNumber = Number(req.query.pn);
      const main = async () => {
        const filesPath = '../../uploadFile';
        const inputPath = path.resolve(__dirname, filesPath, filename);
        await PDFNet.initialize();
        try {
          console.log(inputPath);
          const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
          await pdfdoc.initSecurityHandler();
          const page = await pdfdoc.getPage(pageNumber);

          if (!page) {
            reject('Error ::: no page provided');
          }
          const txt = await PDFNet.TextExtractor.create();
          const rect = new PDFNet.Rect(0, 0, 612, 794);
          txt.begin(page, rect);
          let text;
          text = await txt.getAsText();
          data.push(text);
        } catch (err) {
          console.log(err);
          reject('error', err);
        }
      };

      PDFNetAsyncEndpoint(main)
        .then(() => {
          resolve(data);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  },

  multiLangExtract: (req) => {
    return new Promise(async (resolve, reject) => {
      console.log('multilang extract ');
      if (!req.file || !req.file.path) {
        reject('file path is missing');
      }

      const data = fs.readFileSync(req.file.path);

      try {
        let thesisData = await pdfParse(data);
        const thesisContent = thesisData.text
          .replaceAll('\n', '')
          .replaceAll('\t', '');
        resolve(thesisContent);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  cloudUploadThesisAsync: (req) => {
    return new Promise(async (resolve, reject) => {
      const pdfpath = req.file.path;
      const textpath = req.textPath;
      console.log('INFO :::: data for ', pdfpath, textpath);
      try {
        const pdfRes = await cloudinary.uploader.upload(pdfpath, {
          folder: 'pdfs',
          resource_type: 'auto',
        });
        const textRes = await cloudinary.uploader.upload(textpath, {
          folder: 'texts',
          resource_type: 'auto',
        });
        const res = {
          textRes,
          pdfRes,
        };
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  },
};
