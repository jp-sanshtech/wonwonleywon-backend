const { S3Client} = require("@aws-sdk/client-s3");
const multer = require("multer");

// Set the AWS Region
const REGION = process.env.AWS_REGION_IMAGES; // e.g., "us-east-1"

// Create an Amazon S3 service client object
const s3 = new S3Client({ region: REGION });
const uploadS3 = multer({storage: multer.memoryStorage()})
module.exports = {s3, uploadS3};