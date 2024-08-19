const UserModel = require('../models/user');

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