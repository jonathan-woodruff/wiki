const { UserModel, ErrorLogModel } = require('../models/index');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { 
    SECRET, 
    EMAIL_ADDRESS, 
    APP_PASSWORD, 
    CLIENT_URL, 
    PASSWORD_RESET_SECRET,
    REGISTRATION_SECRET,
    CHANGE_EMAIL_SECRET
} = require('../constants/index');
const nodemailer = require('nodemailer');
const datefns = require('date-fns');
const { createHmac } = require('node:crypto');

exports.protected = (req, res) => {
    res.status(200).json({
        success: true
    });
};

const base64Encode = (data) => {
    const buff = new Buffer.from(data);
    return buff.toString('base64');
};

const base64Decode = (data) => {
    const buff = new Buffer.from(data, 'base64');
    return buff.toString('ascii');
};

const sha256 = (salt, password) => {
    return createHmac('sha256', password)
    .update(salt)
    .digest('hex');
};

//returns true if email sends succesfully, false otherwise
const sendConfEmail = (user) => {
    // Generate the necessary data for the registration confirmation link
    const today = base64Encode(new Date().toISOString());
    const ident = base64Encode(user._id);
    const data = {
        today: today,
        userId: user._id,
        lastUpdated: user.updatedAt.toISOString(),
        password: user.password,
        email: user.email
    };
    const hashedData = sha256(JSON.stringify(data), REGISTRATION_SECRET);
    const params = new URLSearchParams();
    params.append('ident', ident);
    params.append('today', today);
    params.append('data', hashedData);
    const url = `${CLIENT_URL}/create-profile.html?${params.toString()}`;

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
        to: user.email,
        subject: 'Finish signing up | Peace Chickens',
        text: `Hi, ${user.name}.\n\nClick the link to finish signing up to Peace Chickens. If you did not request to sign up, you can safely ignore this email.\n\nThis link will expire in 2 hours.\n\n${url}\n\nJonathan | Peace Chickens`
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await hash(password, 10);
        try {
            const user = new UserModel({
                name: name,
                email: email,
                password: hashedPassword,
                isConfirmed: false
            });
            // Create a new user
            await user.save()
            // send an email for the user to finish registration
            sendConfEmail(user);
            return res.status(201).json({
                success: true,
                error: ''
            })
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not sign you up.'
            });
            const log = new ErrorLogModel({
                email: email || '',
                functionName: 'register',
                description: 'Could not sign you up.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not complete API call.'
        });
        const log = new ErrorLogModel({
            email: email || '',
            functionName: 'register',
            description: 'Could not complete API call.'
        });
        await log.save();
        return;
    }
};

exports.sendConfirmationEmail = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email }).exec();
        sendConfEmail(user)
        return res.status(201).json({
            success: true,
            error: ''
        })
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not send confirmation email.'
        });
        const log = new ErrorLogModel({
            email: req.body.email || '',
            functionName: 'sendConfirmationEmail',
            description: 'Could not send confirmation email.'
        });
        await log.save();
        return;
    }
};

exports.login = async (req, res) => {
    const user = req.user;
    try {
        const payload = {
            id: user._id,
            email: user.email
        };
        const token = await sign(payload, SECRET); //create jwt token
        return res.status(200).cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" }).json({ //send the user a cookie
            avatar: user.photo
        })
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not log you in.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'login',
            description: 'Could not log you in.'
        });
        await log.save();
        return;
    }
};

//delete the cookie
exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', { httpOnly: true, secure: true, sameSite: "none" }).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not log you out.'
        });
        const log = new ErrorLogModel({
            functionName: 'logout',
            description: 'Could not log you out.'
        });
        await log.save();
        return;
    }
};

const sendPasswordChangeEmail = (user) => {
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
        subject: 'Your password changed | Peace Chickens',
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
    const password = req.body.password;
    const user = req.user;  
    try {
        const hashedPassword = await hash(password, 10);
        user.password = hashedPassword;
        try {
            await user.save();
            sendPasswordChangeEmail(user);
            return res.status(201).json({
                success: true,
                message: 'The password change was successful'
            });
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not complete password change.'
            });
            const log = new ErrorLogModel({
                userId: user._id || '',
                email: user.email || '',
                functionName: 'changePassword',
                description: 'Could not complete password change.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not complete API call.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'changePassword',
            description: 'Could not complete API call.'
        });
        await log.save();
        return;
    }
};

exports.sendPasswordResetEmail = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await UserModel.findOne({ email: email }).exec();
        // Generate the necessary data for the password reset link
        const today = base64Encode(new Date().toISOString());
        const ident = base64Encode(user._id);
        const data = {
            today: today,
            userId: user._id,
            lastUpdated: user.updatedAt.toISOString(),
            password: user.password,
            email: user.email
        };
        const hashedData = sha256(JSON.stringify(data), PASSWORD_RESET_SECRET);
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
            subject: 'Your password reset link | Peace Chickens',
            text: `Hi, ${user.name}.\n\nClick the link to reset your Peace Chickens password. If you did not request to reset your password, you can safely ignore this email.\n\nThis link will expire in 2 hours.\n\n${url}\n\nJonathan | Peace Chickens`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({
            success: true,
            error: ''
        })
        
    } catch(error) {
        res.status(500).json({
            success: false,
            error: 'Server error: Could not send email.'
        });
        const log = new ErrorLogModel({
            email: email || '',
            functionName: 'sendPasswordResetEmail',
            description: 'Could not send email.'
        });
        await log.save();
        return;
    }
};

exports.checkResetURL = async (req, res) => {
    // Check if the reset password link is out of date
    const today = base64Decode(req.query.today); 
    const timeSince = datefns.differenceInHours(
        new Date(),
        today
    );
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
    // 1. If the lastLoginDate is changed, user has already done a login 
    // 2. If the salt is changed, the user has already changed the password
    const data = {
        today: req.query.today,
        userId: user._id,
        lastUpdated: user.updatedAt.toISOString(),
        password: user.password,
        email: user.email
    };
    const hashedData = sha256(JSON.stringify(data), PASSWORD_RESET_SECRET);
    if (hashedData !== req.query.data) {
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
    try {
        const userID = base64Decode(req.body.ident);
        const pw = req.body.password;
        const user = await UserModel.findOne({ _id: userID }).exec();
        try {
            const hashedPassword = await hash(pw, 10);
            try {
                user.password = hashedPassword;
                await user.save();
                return res.status(201).json({
                    success: true,
                    message: 'The password reset was successful'
                });
            } catch(error) {
                res.status(500).json({
                    error: 'Server error: Could not reset your password.'
                });
                const log = new ErrorLogModel({
                    userId: user._id || '',
                    email: user.email || '',
                    functionName: 'resetPassword',
                    description: 'Could not reset your password.'
                });
                await log.save();
                return;
            }
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not complete API call.'
            });
            const log = new ErrorLogModel({
                userId: user._id || '',
                email: user.email || '',
                functionName: 'resetPassword',
                description: 'Could not complete API call.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not find your account.'
        });
        const log = new ErrorLogModel({
            functionName: 'resetPassword',
            description: 'Could not find your account.'
        });
        await log.save();
        return;
    }
};

exports.checkConfirmationURL = async (req, res) => {
    // Check if the registration confirmation link in not out of date
    const today = base64Decode(req.query.today); 
    const timeSince = datefns.differenceInHours(
        new Date(),
        today
    );
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

    if (user.isConfirmed) {
        res.status(500).json({
            success: false,
            error: 'User already confirmed'
        });
        return;
    }
    
    // Hash again all the data to compare it with the link
    // The link in invalid when:
    // 1. If the lastLoginDate is changed, user has already done a login 
    // 2. If the salt is changed, the user has already changed the password
    const data = {
        today: req.query.today,
        userId: user._id,
        lastUpdated: user.updatedAt.toISOString(),
        password: user.password,
        email: user.email
    };
    const hashedData = sha256(JSON.stringify(data), REGISTRATION_SECRET);
    if (hashedData !== req.query.data) {
        res.status(500).json({ 
            success: false,
            error: 'Unmatched hash' 
        });
        return;
    }

    //link is valid. mark the user as confirmed
    try {
        user.isConfirmed = true;
        await user.save();
        res.status(201).json({
            success: true,
            error: ''
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            error: 'Server error: Could not confirm your account.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'checkConfirmationURL',
            description: 'Could not confirm your account.'
        });
        await log.save();
        return;
    }
};

exports.magicLogin = async (req, res) => {
    try {
        const userID = base64Decode(req.body.ident);
        const user = await UserModel.findOne({ _id: userID }).exec();
        try {
            const payload = {
                id: user._id,
                email: user.email
            };
            //create jwt token
            const token = await sign(payload, SECRET);
            return res.status(200).cookie('token', token, { httpOnly: true, secure: true, sameSite: "none" }).json({ //send the user a cookie
                success: true,
                error: '',
                avatar: user.avatar
            })
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not log you in.'
            });
            const log = new ErrorLogModel({
                userId: user._id || '',
                email: user.email || '',
                functionName: 'magicLogin',
                description: 'Could not log you in.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not find your account.'
        });
        const log = new ErrorLogModel({
            functionName: 'magicLogin',
            description: 'Could not find your account.'
        });
        await log.save();
        return;
    }
};

exports.sendChangeEmail = async (req, res) => {
    const user = req.user; 
    const toEmail = req.body.email;
    try {        
        // Generate the necessary data for the change-email link
        const today = base64Encode(new Date().toISOString());
        const ident = base64Encode(user._id);
        const newEmail = base64Encode(toEmail);
        const data = {
            today: today,
            userId: user._id,
            lastUpdated: user.updatedAt.toISOString(),
            password: user.password,
            email: user.email,
            newEmail: newEmail
        };
        const hashedData = sha256(JSON.stringify(data), CHANGE_EMAIL_SECRET);
        const params = new URLSearchParams();
        params.append('ident', ident);
        params.append('today', today);
        params.append('new-email', newEmail);
        params.append('data', hashedData);
        const url = `${CLIENT_URL}/email-reset.html?${params.toString()}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: EMAIL_ADDRESS,
            pass: APP_PASSWORD
            }
        });
        
        const mailOptions = {
            from: EMAIL_ADDRESS,
            to: toEmail,
            subject: 'Confirm new email | Peace Chickens',
            text: `Hi, ${user.name}.\n\nClick the link below to change your Peace Chickens login email to this one (${toEmail}).\n\nThe link will expire in 2 hours.\n\n${url}\n\nJonathan | Peace Chickens`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({
            success: true,
            error: ''
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not send confirmation email.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'sendChangeEmail',
            description: 'Could not send confirmation email.'
        });
        await log.save();
        return;
    }
};

exports.tryEmailReset = async (req, res) => {
    // Check if the change-email confirmation link is out of date
    const today = base64Decode(req.query.today); 
    const timeSince = datefns.differenceInHours(
        new Date(),
        today
    );
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
    const data = {
        today: req.query.today,
        userId: user._id,
        lastUpdated: user.updatedAt.toISOString(),
        password: user.password,
        email: user.email,
        newEmail: req.query.newEmail
    }
    const hashedData = sha256(JSON.stringify(data), CHANGE_EMAIL_SECRET);
    if(hashedData !== req.query.data) {
        res.status(500).json({ 
            success: false,
            error: 'Unmatched hash' 
        });
        return;
    }

    //link is valid. change the user's email
    try {
        user.email = base64Decode(req.query.newEmail);
        await user.save();
        res.status(201).json({
            success: true,
            error: ''
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            error: 'Server error: Could not confirm your account.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'tryEmailReset',
            description: 'Could not confirm your account.'
        });
        await log.save();
        return;
    }
};