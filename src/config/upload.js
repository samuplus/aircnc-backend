const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const storageTypes = {
    // Stores locally
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..','..', 'uploads'));
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            crypto.randomBytes(8, (err, hash) => {
                if (err) cb(err);
                file.key = `${name}-${Date.now()}-${hash.toString('hex')}${ext}`;
                cb(null, file.key);
            });
        }
    }),

    // Stores on S3
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            crypto.randomBytes(8, (err, hash) => {
                if (err) cb(err);
                const filename = `${name}-${Date.now()}-${hash.toString('hex')}${ext}`;
                cb(null, filename);
            });
        }
    })
}


module.exports = {
    dest: path.resolve(__dirname, "..", "..", "uploads"),
    // Set the type of storage to be used -> local or AWS S3
    // storage: storageTypes[process.env.STORAGE_TYPE],
    storage: storageTypes[process.env.STORAGE_TYPE],
    // Set max image size
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjepg',
            'image/png',
            'image/gif'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
};