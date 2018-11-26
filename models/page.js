const mongoose = require('mongoose');

const PageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Pages', PageSchema);