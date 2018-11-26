const mongoose = require('mongoose');

const CatSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
})

module.exports = mongoose.model('Categories', CatSchema);
