const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

global.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
global.CLOUDINARY_API_KEY = CLOUDINARY_API_KEY;
global.CLOUDINARY_API_SECRET = CLOUDINARY_API_SECRET;
