const Comment = require('../models/comment');

require('dotenv').config();
const jwt = require('jsonwebtoken');

const createComment = async (req, res, next) => {
    const {username, email, blogTitle, content} = req.body;

    try {
        await Comment.create({
            username: username,
            email: email,
            content: content,
            blogName: blogTitle,
        })
        .then(data => res.status(200).json({
            message: "Succesfully created blog",
            data: data
            })
        )   
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const getComments = async (req, res, next) => {
    const blogName = req.params.id;
    const arr = []

    try {
        const comments = await Comment.find({'blogName': blogName}).sort({$natural: -1});
        
        comments.forEach(function(err, index) {
            arr.push({
                username: comments[index].username,
                content: comments[index].content
            })
        })
        arr.reverse();
        res.send(arr);

    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

module.exports = {
    createComment,
    getComments
}