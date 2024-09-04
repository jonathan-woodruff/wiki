const WikisModel = require('../models/wikis');
const UserModel = require('../models/user');
const WikiHistoryModel = require('../models/wikiHistory');
const { parseServices } = require('../utils/index');

exports.postWiki = async (req, res) => {
    const country = req.body.country;
    const sector = req.body.sector;
    const title = req.body.title;
    const contentTime = req.body.article.time;
    const contentBlocks = req.body.article.blocks;
    const contentVersion = req.body.article.version;
    try {
        /* post to the wiki model */
        const newWiki = new WikisModel({
            country: country,
            sector: sector,
            title: title,
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        const savedWiki = await newWiki.save();

        /* post to the wiki history model */
        const user = await UserModel.findOne({ email: req.user.email }).exec();
        const newWikiHistory = new WikiHistoryModel({
            wikiId: savedWiki._id,
            authorUserId: user._id,
            changeDescription: 'created wiki',
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        await newWikiHistory.save();
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

exports.getWikis = async (req, res) => {
    try {
        const country = req.query.country;
        const sector = req.query.sector;
        let wikis;
        if (country === 'All' && sector === 'All') {
            wikis = await WikisModel.find().exec();
        } else if (country === 'All') {
            wikis = await WikisModel.find({ sector: sector }).exec();
        } else if (sector === 'All') {
            wikis = await WikisModel.find({ country: country }).exec();
        } else { //both country and sector are selected to be filtered
            wikis = await WikisModel.find({ country: country, sector: sector }).exec();
        }
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

exports.getWikiByID = async (req, res) => {
    try {
        const wikiID = req.query.wiki;
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
        if (wiki) {
            return res.status(200).json({
                wiki: wiki
            });
        }
    } catch(error) {
        res.status(500).json({
            error: 'did not find wiki'
        })
    }
};

exports.publishWikiEdits = async (req, res) => {
    const wikiId = req.body.wikiId;
    const contentTime = req.body.article.time;
    const contentBlocks = req.body.article.blocks;
    const contentVersion = req.body.article.version;
    const changeDescription = req.body.changeDescription;
    try {
        /* update the wiki in the wikis model */
        const wiki = await WikisModel.findOne({ _id: wikiId }).exec();
        wiki.contentTime = contentTime;
        wiki.contentBlocks = contentBlocks;
        wiki.contentVersion = contentVersion;
        await wiki.save();
        /* add the wiki version to the wiki history model */
        const user = await UserModel.findOne({ email: req.user.email }).exec();
        const newWikiEdit = new WikiHistoryModel({
            wikiId: wikiId,
            authorUserId: user._id,
            changeDescription: changeDescription,
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        await newWikiEdit.save();
        return res.status(200).json({
            success: true,
            message: 'updated wiki'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Did not update wiki successfully'
        });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const wikiID = req.query.wiki;
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
        const wikiHistory = await WikiHistoryModel.find({ wikiId: wikiID }).exec();
        if (wiki && wikiHistory) {
            return res.status(200).json({
                wiki: wiki,
                wikiHistory: wikiHistory
            });
        }
    } catch(error) {
        res.status(500).json({
            error: 'did not find wiki or wiki history'
        })
    }
};