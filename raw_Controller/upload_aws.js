
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')
const logUpload = require('./uploadlog')
require('dotenv').config()
const fs = require('fs')



let s3 = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.ACCESS_SECRET_AWS,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: '11q3-a',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const timestamp = Date.now().toString();
      const fileExtension  = file.originalname.split('.').pop();

      const newFileName = `${timestamp}_.${fileExtension}`;

      console.log('New FileName:', newFileName);
      logUpload(newFileName, Date.now());
      cb(null, newFileName);

    }
  }) 
});




module.exports = upload
