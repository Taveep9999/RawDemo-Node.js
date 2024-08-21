const { S3Client } = require('@aws-sdk/client-s3')
const multer  = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')
require('dotenv').config()
const fs = require('fs').promises
const { GetObjectCommand, HeadObjectCommand ,DeleteObjectCommand  } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.ACCESS_SECRET_AWS,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

async function download(req, res) {
  const filename = req.body.filename;
  const fileKey = filename;

  try {
    await s3.send(new HeadObjectCommand({ Bucket: 'test1234', Key:fileKey }));
  } catch (error) {
    console.error('errorlog:', error);
  }
  try {
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: 'test1234', Key:fileKey }));
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    Body.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function DDelete(req, res,filename) {
  const fileKey = filename

  try {
    await s3.send(new HeadObjectCommand({ Bucket: 'test1234', Key:fileKey }));
  } catch (error) {
    console.error('errorlog:', error);
    res.status(404).send('File not found');
    return;
  }
  try {
    const { Body } = await s3.send(new DeleteObjectCommand({ Bucket: 'test1234', Key:fileKey }));
    await s3.send(new DeleteObjectCommand({ Bucket: 'test1234', Key: fileKey }));
  } catch (error) {
    console.error('Error delete file:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {download,DDelete}