const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    storage: multer.diskStorage({ 
        destination: path.resolve(__dirname, '..','..', 'uploads'),
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.resolve(__dirname, '..','..', 'uploads'));
            },
        }),
        // Set max image size
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        // Unable the upload of certain file types
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
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            crypto.randomBytes(8, (err, hash) => {
                if (err) cb(err);
                const filename = `${name}-${Date.now()}-${hash.toString('hex')}-${ext}`;
                cb(null, filename);
            });
        },
    }),
};