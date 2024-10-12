const { UserModel } = require('../models/index');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET, EMAIL_ADDRESS, APP_PASSWORD, CLIENT_URL } = require('../constants/index');
const nodemailer = require('nodemailer');


exports.protected = (req, res) => {
    res.status(200).json({
        success: true
    });
    /*console.log(req.user);
    console.log('y01');
    if (req.user) {
        console.log('di');
        res.status(200).json({
            isAuth: true
        });
    } /*else {
        res.status(200).json({
            isAuth: false
        });
    }*/
};


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

exports.updateUserName = async (req, res) => {
    try {
        const user = req.user;
        user.name = req.body.name;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'updated user name'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Did not update user name successfully'
        });
    }
};

exports.updateUserEmail = async (req, res) => {
    try {
        const user = req.user;
        user.email = req.body.email;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'updated user email'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Did not update user email successfully'
        });
    }
};

const base64Encode = (data) => {
    const buff = new Buffer.from(data);
    return buff.toString('base64');
}

const base64Decode = (data) => {
    const buff = new Buffer.from(data, 'base64');
    return buff.toString('ascii');
}

exports.sendPasswordResetEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email: email }).exec();
        // Generate the necessary data for the password reset link
        const today = base64Encode(new Date().toISOString());
        const ident = base64Encode(user._id.toString());
        const data = {
            today: today,
            userId: user._id,
            lastUpdated: user.updatedAt.toISOString(),
            password: user.password,
            email: user.email
        };
        const hashedData = await hash(data, 10);
        const params = new URLSearchParams();
        params.append('ident', ident);
        params.append('today', today);
        params.append('data', hashedData);
        const url = `${CLIENT_URL}/password-reset.html?${params.toString()}`;

        //send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: EMAIL_ADDRESS,
              pass: APP_PASSWORD
            }
        });
          
        const mailOptions = {
            from: EMAIL_ADDRESS,
            to: email,
            subject: 'Your password reset link',
            text: `Hi, ${user.name}.\n\nClick the link to reset your Peace Chickens password. If you did not request to reset your password, you can safely ignore this email\n\n${url}\n\nJonathan | Peace Chickens`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
        
    } catch(error) {
        res.status(500).json({
            error: 'Email did not send'
        });
    }
};

exports.checkResetURL = async (req, res) => {
    // Check if the reset password link in not out of date
    const today = base64Decode(req.query.today); 
    const then = moment(today); 
    const now = moment().utc(); 
    const timeSince = now.diff(then, 'hours');
    if (timeSince > 2) {
        res.status(500).json({ 
            success: false,
            error: 'Link is outdated' 
        });
        return;
    }

    const userID = base64Decode(req.query.ident);
    const user = await UserModel.findOne({ _id: userID }).exec();
    if (!user) {
        res.status(500).json({ 
            success: false,
            error: 'Invalid user' 
        });
        return;
    }

    // Hash again all the data to compare it with the link
    // The link in invalid when:
    // 1. If the lastLoginDate is changed, user has already do a login 
    // 2. If the salt is changed, the user has already changed the password
    const data = {
        today: req.query.today,
        userId: user._id,
        lastUpdated: user.updatedAt.toISOString(),
        password: user.password,
        email: user.email
    };
    const hashedData = await hash(data, 10);

    if(hashedData !== req.query.data) {
        res.status(500).json({ 
            success: false,
            error: 'Unmatched hash' 
        });
        return;
    }

    res.status(201).json({
        success: true,
        error: ''
    });
};

exports.resetPassword = async (req, res) => {
    const userID = base64Decode(req.body.ident);
    const pw = req.body.changedPassword;

    try {
        const user = await UserModel.findOne({ _id: userID }).exec();
        const hashedPassword = await hash(pw, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(201).json({
            success: true,
            message: 'The password reset was successful'
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};