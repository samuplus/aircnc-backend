const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
    thumbnail: String,
    thumbname: String,
    thumbsize: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    company: String,
    price: Number,
    techs: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON: {
        virtuals: true,
    }
});

SpotSchema.virtual('thumbnail_url').get(function() {
    return `${process.env.APP_URL}/files/${this.thumbnail}`
    // return `http://localhost:3333/files/${this.thumbnail}`
})
module.exports = mongoose.model('Spot', SpotSchema);