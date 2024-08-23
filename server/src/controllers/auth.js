const UserModel = require('../models/user');
const db = require('../db');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants/index');

exports.addDumbUser = async (req, res) => {
    try {
        const newUser = new UserModel({
            email: 'ADA.LOVELACE@GMAIL.COM'
        });
        console.log(newUser);
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'dumb user added dawg'
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.protected = (req, res) => {
    try {
        res.status(200).json({
            info: 'protected info'
        });
    } catch(error) {
        console.log(error.message);
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await hash(password, 10);
        const newUser = new UserModel({
            email: email,
            password: hashedPassword
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
        id: user.user_id,
        email: user.email
    };
    try {
        const token = await sign(payload, SECRET); //create jwt token
        return res.status(200).cookie('token', token, { httpOnly: true, secure: true }).json({ //send the user a cookie
            success: true,
            message: 'Logged in successfully'
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