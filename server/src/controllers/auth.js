const { UserModel } = require('../models/index');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET, EMAIL_ADDRESS, APP_PASSWORD } = require('../constants/index');
const nodemailer = require('nodemailer');

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

const sendPasswordChangeEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_ADDRESS,
          pass: APP_PASSWORD
        }
    });
      
    const mailOptions = {
        from: EMAIL_ADDRESS,
        to: user.email,
        subject: 'Your password changed',
        text: 'Hi, ' + user.name + '.\n\nYour Peace Chickens password changed successfully. If you did not change your password, please reply to let me know.\n\nJonathan | Peace Chickens'
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
};

exports.changePassword = async (req, res) => {    
    const password = req.body.changedPassword;
    try {
        const user = req.user;
        const hashedPassword = await hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await sendPasswordChangeEmail(user)
        return res.status(201).json({
            success: true,
            message: 'The password change was successful'
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};