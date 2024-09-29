const { UserModel } = require('../models/index');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants/index');

/*
exports.protected = (req, res) => {
    console.log(req.user);
    console.log('y01');
    if (req.user) {
        console.log('di');
        res.status(200).json({
            isAuth: true
        });
    } else {
        res.status(200).json({
            isAuth: false
        });
    }
};
*/

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await hash(password, 10);
        const newUser = new UserModel({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'The registration was successful'
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    const user = req.user;
    const payload = {
        id: user._id,
        email: user.email
    };
    try {
        const token = await sign(payload, SECRET); //create jwt token
        return res.status(200).cookie('token', token, { httpOnly: true, secure: true }).json({ //send the user a cookie
            avatar: user.photo
        })
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};

//delete the cookie
exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', { httpOnly: true, secure: true }).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};