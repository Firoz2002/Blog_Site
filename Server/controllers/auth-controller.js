const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();
const jwtSecret = process.env.SECRET;

const register = async (req, res, next) => {
    const { username, password, email } = req.body;
    
    try {
        
        if(password.length < 6) {
            return res.status(400).json({ message: "Password less than 6 characters" })
        } 
        
        const hash = await bcrypt.hash(password, 10);
        
        await User.create({
            username,
            email,
            password: hash,
        }).then((user) => {
            const maxAge = 3*60*60;
            const token = jwt.sign(
                { id: user._id, username },
                jwtSecret,
                {
                    expiresIn: maxAge,
                }
            );
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge*100,
            });
            res.status(200).json({
            message: "User successfully created",
            user,
            })
        })
       
    } catch (err) {
        res.status(401).json({
            message: "Some error occured",
            error: err,
        })
    }
}

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({
            message: "Username or Password not provided"
        })
    }
    
    try {
        const user = await User.findOne({ username });

        if(!user) {
            res.status(401).json({
                message: "Login Unsuccessful",
                error: "User not found",
            })
        } else {
            bcrypt.compare(password, user.password).then(function (result) { 
                if (result) {
                    const maxAge = 3*60*60;
                    const token = jwt.sign(
                        {id: user._id, username},
                        jwtSecret,
                        {
                            expiresIn: maxAge,
                        }
                    );
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        maxAge: maxAge*1000,
                    });
                    res.status(201).json({
                        message: "Login Successful",
                        user: user._id,
                    });
                } else {
                    res.status(403).json({
                        message: "Login Failed"
                    });
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error,
        })
    }
}

const islogged = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (token) {
            const decoded = jwt.verify(token, jwtSecret);

            const found = await User.findById(decoded.id);

            if (found) {
                return res.status(200).json({
                    islogged: true
                })
            } else {
                return res.status(400).json({
                    islogged: false
                })
            }
        } else {
            return res.status(400).json({
                islogged: false
            })
        }
    } catch (error) {
        throw {error}
    }
}

const userAuth = (req, res, next) => {
    const token = req.cookies.jwt

    try {
        if(token) {
            jwt.verify(token, jwtSecret, (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({message: "Not authorized"})
                } else {
                    next();
                }
            })
        } else {
            return res.status(401).json({message: "Not authorized, token not avaliable"})
        }
    } catch (error) {
        throw {error}
    }
}

module.exports = {
    register,
    login,
    islogged
}