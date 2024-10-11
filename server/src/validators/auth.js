const { check } = require('express-validator');
const { compare } = require('bcrypt');
const db = require('../db');
const { UserModel } = require('../models/index');

//password
const password = check('password').isLength({ min: 6, max: 15 }).withMessage('Password must be between 6 and 15 characters');

const changedPassword = check('changedPassword').isLength({ min: 6, max: 15 }).withMessage('Password must be between 6 and 15 characters');

const correctCurrentPassword = check('currentPassword').custom(async(value, { req }) => {
    const user = req.user;
    const correctPassword = await compare(req.body.currentPassword, user.password);
    if (!correctPassword) {
        throw new Error('Incorrect current password');
    }
})

//email
const email = check('email').isEmail().withMessage('Please enter a valid email address');

//check if email exists
const emailExists = check('email').custom(async (value) => {
    const rows = await UserModel.findOne({ email: value }).exec();

    if (rows) {
        throw new Error('Email already exists');
    }
});

//login validation
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
    const user = await UserModel.findOne({ email: value }).exec();
    if (!user) {
        throw new Error('Email does not exist');
    }
    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword) {
        throw new Error('Wrong password');
    }
    req.user = user;
});

module.exports = {
    registerValidation: [email, password, emailExists],
    loginValidation: [email, loginFieldsCheck],
    changePasswordValidation: [correctCurrentPassword, changedPassword],
    changeEmailValidation: [email, emailExists]
};
