const WikisModel = require('../models/wikis');
const UserModel = require('../models/user');
const { parseServices } = require('../utils/index');

exports.postWiki = async (req, res) => {
    const country = req.body.country;
    const sector = req.body.sector;
    const title = req.body.title;
    const contentTime = req.body.article.time;
    const contentBlocks = req.body.article.blocks;
    const contentVersion = req.body.article.version;
    try {
        const newWiki = new WikisModel({
            country: country,
            sector: sector,
            title: title,
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        await newWiki.save();
        return res.status(201).json({
            success: true,
            message: 'new wiki created'
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

/*
exports.getWiki = async (req, res) => {
    try {
        const wiki = await WikisModel.findOne({}).exec();
        return res.status(200).json({
            contentTime: wiki.contentTime,
            contentBlocks: wiki.contentBlocks,
            contentVersion: wiki.contentVersion
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};
*/

exports.getWikis = async (req, res) => {
    try {
        const wikis = await WikisModel.find().exec();
        return res.status(200).json({
            wikis: wikis
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getProfileData = (req, res) => {
    const user = req.user;
    if (user) {
        return res.status(200).json({
            photo: user.photo,
            services: user.services,
            description: user.description
        });
    } else {
        res.status(500).json({
            error: 'user is falsy'
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.user.email }).exec();
        user.photo = req.body.photo;
        user.services = req.body.services;
        user.description = req.body.description;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'updated profile'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Did not update profile successfully'
        });
    }
};

exports.getCreateWikiData = (req, res) => {
    const user = req.user;
    if (user) {
        const [countries, sectors] = parseServices(user.services);
        return res.status(200).json({
            countries: countries,
            sectors: sectors
        });
    } else {
        res.status(500).json({
            error: 'user is falsy'
        });
    }
};