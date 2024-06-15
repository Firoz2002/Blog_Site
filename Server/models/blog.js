const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    userId: {
        min: 5,
        max: 30,
        type: String,
        require: true,
    },
    title: {
        max: 55,
        type: String,
        require: true,
    },
    content: {
        min: 30,
        type: String,
        require: true
    },
    bannerImage: {
        type: String,
    }

}, {timestamps: true});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;