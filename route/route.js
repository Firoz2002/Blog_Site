const multer = require('multer');
const express = require('express');

const { storage } = require('../config/storage');
const { createBlog, getBlogs, getBlog } = require('../controllers/blog-controller');
const { register, login, islogged} = require('../controllers/auth-controller');

const upload = multer({ storage });
const router = express.Router();

router.route('/getBlogs').get(getBlogs);

router.route('/islogged').get(islogged);
router.route('/register').post(register);
router.route('/login').post(login);

router.route('/publish').post(createBlog);
router.route('/getBlog/:id').get(getBlog);

router.route('/upload').post( upload.single('image'), (req, res) => {res.json(req.file.path)});

module.exports = router;