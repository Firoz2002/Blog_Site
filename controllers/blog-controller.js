require('dotenv').config();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');

const createBlog = async (req, res, next) => {
    const {title, content, bannerImage} = req.body;
    const username = jwt.verify(req.cookies.jwt, process.env.SECRET).username;
    try {
        await Blog.create({
            userId: username,
            title: title,
            content: content,
            bannerImage: bannerImage
        }).then(data => res.status(200).json({
            message: "Succesfully created blog",
            data
            })
        )   
    } catch (err) {
        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const getBlog = async (req, res, next) => {
    try {
        const data = await Blog.findOne({ title: req.query.title });
        data.title = data.title.replaceAll('-', ' ');
        
        res.send(data);
    } catch (err) {
        res.status(401).json({
            message: "Some error occured",
            error: err
        })
    }
}

const getBlogs = async (req, res, next) => {
    var arr = []
    try {
        var blogs = await Blog.find().sort({$natural: -1}).limit(9);
        
        blogs.forEach(function(err, index) {
            arr.push({
                title: blogs[index].title,
                content: blogs[index].content.slice(0, 35),
                bannerImage: blogs[index].bannerImage
            })
        })
        arr.reverse();
        res.send(arr);
    } catch (err) {
        throw {err};
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlog
}