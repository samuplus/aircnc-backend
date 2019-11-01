require('dotenv').config();

const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs')                // Node lib that handle files
const path = require('path')            // Locate file
const { promisify } = require('util')   // Convert callback to promise

const s3 = new aws.S3();

const SpotSchema = new mongoose.Schema({
    thumbnail: String,      // original image name
    key: String,            // modified image name
    size: Number,           // image size
    url: String,            // image link
    createdAt: {
        type: Date,         // image creation date
        default: Date.now
    },
    company: String,        // company name
    price: Number,          // daily costrequire('dotenv').config();
    techs: [String],        // list of techs used at company
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
// }
// , 
// {
//     toJSON: {
//         virtuals: true,     // thumbnail url
    // }
});

// If URL is empty (saving on disk), complete URL using moongose static method
SpotSchema.pre('save', function() {
    if (!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
});
// SpotSchema.virtual('thumbnail_url').get(function() {
//     return `${process.env.APP_URL}/files/${this.key}`
//     // return `http://localhost:3333/files/${this.thumbnail}`
// })

SpotSchema.pre('remove', function() {
    // Checks where image is stored and deletes accordingly
    if (!this.url.includes(process.env.LOCAL_FILE_STORAGE)) {
        // delete files from S3
        return s3.deleteObject({
            Bucket: process.env.AWS_BUCKET,
            Key: this.key
        }).promise()
    } else {
        // delete file from local storage (uploads folder)
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'uploads', this.key));
    }
})
module.exports = mongoose.model('Spot', SpotSchema);