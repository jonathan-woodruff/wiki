const WikisModel = require('../models/wikis');

exports.postWiki = async (req, res) => {
    const contentTime = req.body.time;
    const contentBlocks = req.body.blocks;
    const contentVersion = req.body.version;
    try {
        const newWiki = new WikisModel({
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