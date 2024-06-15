const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true
    },
    blogName: {
        type: String,
        require: true
    },
    content: {
        min: 10,
        type: String,
        require: true
    }

}, {timestamps: true});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;