const { UserModel, WikisModel, WikiHistoryModel, CommunityModel, ErrorLogModel } = require('../models/index');
const { parseServices } = require('../utils/index');
const { STRIPE_KEY, EMAIL_ADDRESS, APP_PASSWORD } = require('../constants/index');
const stripe = require('stripe')(STRIPE_KEY);
const nodemailer = require('nodemailer');

exports.postDraft = async (req, res) => {
    const user = req.user;
    try {
        const newWiki = new WikisModel({
            originalAuthorUserId: user._id,
            originalAuthorUserObjectId: user._id,
            isPublished: false,
            country: 'All',
            sector: 'All',
            title: '',
            contentTime: req.body.article.time,
            contentBlocks: req.body.article.blocks,
            contentVersion: req.body.article.version
        });
        const savedWiki = await newWiki.save();
        return res.status(201).json({
            wikiID: savedWiki._id
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error: Could not create draft.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'postDraft',
            description: 'Could not create draft.'
        });
        await log.save();
        return;
    }
};

exports.putDraft = async (req, res) => {
    const user = req.user;
    try {
        const wikiID = req.body.wikiID;
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
        try {
            const isPublished = req.body.isPublished;
            wiki.isPublished = isPublished;
            wiki.country = req.body.country;
            wiki.sector = req.body.sector;
            wiki.title = req.body.title;
            wiki.contentTime = req.body.article.time;
            wiki.contentBlocks = req.body.article.blocks;
            wiki.contentVersion = req.body.article.version;
            const savedWiki = await wiki.save();
            if (isPublished) {
                try {
                    // post to the wiki history model
                    const newWikiHistory = new WikiHistoryModel({
                        wikiId: savedWiki._id,
                        authorUserId: user._id,
                        wikiObjectId: savedWiki._id,
                        authorUserObjectId: user._id,
                        changeDescription: 'created wiki',
                        contentTime: req.body.article.time,
                        contentBlocks: req.body.article.blocks,
                        contentVersion: req.body.article.version
                    });
                    await newWikiHistory.save();
                    try {
                        // update the user model 
                        user.wikisCreated++;
                        await user.save();
                        return res.status(201).json({
                            wikiID: savedWiki._id
                        });
                    } catch(error) {
                        res.status(201).json({
                            wikiID: savedWiki._id
                        });
                        const log = new ErrorLogModel({
                            userId: user._id || '',
                            email: user.email || '',
                            functionName: 'putDraft',
                            description: 'Could not update your user stats.'
                        });
                        await log.save();
                        return;
                    }
                } catch(error) {
                    res.status(201).json({
                        wikiID: savedWiki._id
                    });
                    const log = new ErrorLogModel({
                        userId: user._id || '',
                        email: user.email || '',
                        functionName: 'putDraft',
                        description: 'Could not save wiki history.'
                    });
                    await log.save();
                    return;
                }
            } else {
                return res.status(201).json({
                    success: true
                });
            }
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not save.'
            });
            const log = new ErrorLogModel({
                userId: user._id || '',
                email: user.email || '',
                functionName: 'putDraft',
                description: 'Could not save. Trying to publish = ' + isPublished
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not find draft.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'putDraft',
            description: 'Could not find draft.'
        });
        await log.save();
        return;
    }
};

exports.getWikis = async (req, res) => {
    try {
        const country = req.query.country;
        const sector = req.query.sector;
        let wikis;
        if (country === 'All' && sector === 'All') {
            wikis = await WikisModel.find({ isPublished: true }).sort({ 'updatedAt': -1 }).exec();
        } else if (country === 'All') {
            wikis = await WikisModel.find({ isPublished: true, sector: sector }).sort({ 'updatedAt': -1 }).exec();
        } else if (sector === 'All') {
            wikis = await WikisModel.find({ isPublished: true, country: country }).sort({ 'updatedAt': -1 }).exec();
        } else { //both country and sector are selected to be filtered
            wikis = await WikisModel.find({ isPublished: true, country: country, sector: sector }).sort({ 'updatedAt': -1 }).exec();
        }
        return res.status(200).json({
            wikis: wikis
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not load wikis.'
        });
        const log = new ErrorLogModel({
            functionName: 'getWikis',
            description: 'Could not load wikis.'
        });
        await log.save();
        return;
    }
};

exports.getProfileData = async (req, res) => {
    const user = req.user;
    if (user) {
        return res.status(200).json({
            name: user.name,
            email: user.email,
            photo: user.photo,
            services: user.services,
            description: user.description
        });
    } else {
        res.status(500).json({
            error: 'Server error: Could not load profile data.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'getProfileData',
            description: 'Could not load profile data.'
        });
        await log.save();
        return;
    }
};

exports.updateProfile = async (req, res) => {
    const user = req.user;
    try {
        const avatarURL = req.body.avatarURL;
        if (avatarURL !== 'not changed') user.photo = req.body.avatarURL;
        user.name = req.body.name;
        user.services = req.body.services;
        user.description = req.body.description;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'updated profile'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not save profile.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'updateProfile',
            description: 'Could not save profile.'
        });
        await log.save();
        return;
    }
};

exports.getCreateWikiData = async (req, res) => {
    const user = req.user;
    const wikiID = req.query.wiki;
    try {
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
        if (user && !wiki.isPublished && user._id.equals(wiki.originalAuthorUserObjectId)) {
            const [countries, sectors] = parseServices(user.services);
            return res.status(200).json({
                countryOptions: countries,
                sectorOptions: sectors,
                country: wiki.country,
                sector: wiki.sector,
                title: wiki.title,
                contentTime: wiki.contentTime,
                contentBlocks: wiki.contentBlocks,
                contentVersion: wiki.contentVersion
            });
        } else if (wiki.isPublished) {
            return res.status(500).json({
                error: 'Wiki is published'
            });
        } else if (!user._id.equals(wiki.originalAuthorUserObjectId)) {
            return res.status(500).json({
                error: 'User is not the author'
            });
        } else {
            res.status(500).json({
                error: 'Server error: Could not load data.'
            });
            const log = new ErrorLogModel({
                userId: user._id || '',
                email: user.email || '',
                functionName: 'getCreateWikiData',
                description: 'Could not load data.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not find wiki.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'getCreateWikiData',
            description: 'Could not find wiki.'
        });
        await log.save();
        return;
    }
};

exports.getWikiByID = async (req, res) => {
    const wikiID = req.query.wiki;
    try {
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
        if (wiki.isPublished) {
            return res.status(200).json({
                wiki: wiki
            });
        } else {
            return res.status(500).json({
                error: 'Wiki is a draft'
            })
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not load wiki.'
        });
        const log = new ErrorLogModel({
            functionName: 'getWikiByID',
            description: 'Could not load wiki.'
        });
        await log.save();
        return;
    }
};

exports.publishWikiEdits = async (req, res) => {
    const user = req.user;
    try {
        const wikiId = req.body.wikiId;
        const contentTime = req.body.article.time;
        const contentBlocks = req.body.article.blocks;
        const contentVersion = req.body.article.version;
        const changeDescription = req.body.changeDescription;
        const wiki = await WikisModel.findOne({ _id: wikiId }).exec();
        try {
            wiki.contentTime = contentTime;
            wiki.contentBlocks = contentBlocks;
            wiki.contentVersion = contentVersion;
            await wiki.save();
            try {
                // add the wiki version to the wiki history model
                const newWikiEdit = new WikiHistoryModel({
                    wikiId: wikiId,
                    authorUserId: user._id,
                    wikiObjectId: wikiId,
                    authorUserObjectId: user._id,
                    changeDescription: changeDescription,
                    contentTime: contentTime,
                    contentBlocks: contentBlocks,
                    contentVersion: contentVersion
                });
                await newWikiEdit.save();
                try {
                    // update the user model
                    user.wikiEdits++;
                    await user.save();
                    return res.status(200).json({
                        success: true,
                        message: 'updated wiki'
                    });
                } catch(error) {
                    //return successful wiki save but log an error about the user stats
                    res.status(200).json({
                        success: true,
                        message: 'updated wiki'
                    });
                    const log = new ErrorLogModel({
                        userId: user._id || '',
                        email: user.email || '',
                        functionName: 'publishWikiEdits',
                        description: 'Could not save your user stats.'
                    });
                    await log.save();
                    return;
                }
            } catch(error) {
                res.status(500).json({
                    error: 'Server error: Could not save wiki history.'
                });
                const log = new ErrorLogModel({
                    userId: user._id || '',
                    email: user.email || '',
                    functionName: 'publishWikiEdits',
                    description: 'Could not save wiki history.'
                });
                await log.save();
                return;
            }
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not save wiki.'
            });
            const log = new ErrorLogModel({
                userId: user._id || '',
                email: user.email || '',
                functionName: 'publishWikiEdits',
                description: 'Could not save wiki.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not find wiki.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'publishWikiEdits',
            description: 'Could not find wiki.'
        });
        await log.save();
        return;
    }
};

exports.getHistory = async (req, res) => {
    try {
        const wikiID = req.query.wiki;
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
        try {
            const wikiHistory = await WikiHistoryModel
            .aggregate([
                {
                    $match: { wikiId: wikiID }
                },
                {
                    $sort: { contentTime: -1 }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'authorUserObjectId',
                        foreignField: '_id',
                        as: 'user'
                    }
                }
            ])
            .exec();
            if (wiki && wikiHistory.length) {
                return res.status(200).json({
                    wiki: wiki,
                    wikiHistory: wikiHistory
                });
            } else {
                res.status(500).json({
                    error: 'Server error: Could not load wiki history.'
                })
                const log = new ErrorLogModel({
                    functionName: 'getHistory',
                    description: 'Could not load wiki history.'
                });
                await log.save();
                return;
            }
        } catch(error) {
            res.status(500).json({
                error: 'Server error: Could not find wiki history.'
            })
            const log = new ErrorLogModel({
                functionName: 'getHistory',
                description: 'Could not find wiki history.'
            });
            await log.save();
            return;
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not find wiki.'
        })
        const log = new ErrorLogModel({
            functionName: 'getHistory',
            description: 'Could not find wiki.'
        });
        await log.save();
        return;
    }
};

exports.getViewProfileData = async (req, res) => {
    const userID = req.query.user;
    const user = await UserModel.findOne({ _id: userID }).exec();
    if (user) {
        return res.status(200).json({
            name: user.name,
            photo: user.photo,
            services: user.services,
            description: user.description,
            wikisCreated: user.wikisCreated,
            wikiEdits: user.wikiEdits
        });
    } else {
        res.status(500).json({
            error: 'Server error: Could not get profile data.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'getViewProfileData',
            description: 'Could not get profile data.'
        });
        await log.save();
        return;
    }
};

exports.getHistoricalWikiData = async (req, res) => {
    const wikiHistoryID = req.query.wikiHistoryID;
    const wikiHistory = await WikiHistoryModel.findOne({ _id: wikiHistoryID }).exec();
    const wiki = await WikisModel.findOne({ _id: wikiHistory.wikiId }).exec();
    const user = await UserModel.findOne({ _id: wikiHistory.authorUserId });
    if (wikiHistory && wiki && user) {
        return res.status(200).json({
            wikiID: wikiHistory.wikiId,
            country: wiki.country,
            sector: wiki.sector,
            title: wiki.title,
            changeDescription: wikiHistory.changeDescription,
            userID: wikiHistory.authorUserId,
            photo: user.photo,
            authorName: user.name,
            contentTime: wikiHistory.contentTime,
            contentBlocks: wikiHistory.contentBlocks,
            contentVersion: wikiHistory.contentVersion
        });
    } else {
        res.status(500).json({
            error: 'Server error: Could not load historical wiki data.'
        });
        const log = new ErrorLogModel({
            functionName: 'getHistoricalWikiData',
            description: 'Could not load historical wiki data.'
        });
        await log.save();
        return;
    }
};

exports.postCommunity = async (req, res) => {
    const user = req.user;
    try {
        const newCommunityEntry = new CommunityModel({
            userId: user._id,
            userObjectId: user._id,
            reason: req.body.reason,
            amount: req.body.amount,
            other: req.body.other
        });
        await newCommunityEntry.save();
        return res.status(201).json({
            success: true
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not save submission.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'postCommunity',
            description: 'Could not save submission.'
        });
        await log.save();
        return;
    }
};

const calculateOrderAmount = (items) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
      total += item.amount;
    });
    return total;
};

exports.createPaymentIntent = async (req, res) => {
  const items = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(201).json({
    clientSecret: paymentIntent.client_secret,
    // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
};

exports.sendEmail = (req, res) => {
    toEmail = req.body.email;
    subject = req.body.subject;
    body = req.body.body;

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
        subject: subject,
        text: body
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
};

exports.getMyStuff = async (req, res) => {
    const user = req.user;
    try {
        const draftedWikis = await WikisModel.find({ originalAuthorUserId: user._id, isPublished: false }).sort({ 'updatedAt': -1 }).exec();
        const publishedHistories = await WikiHistoryModel
        .aggregate([
            {
                $match: { authorUserObjectId: user._id, changeDescription: 'created wiki' }
            },
            {
                $sort: { 'createdAt': -1 }
            },
            {
                $lookup: {
                    from: 'wikis',
                    localField: 'wikiObjectId',
                    foreignField: '_id',
                    as: 'wikis'
                }
            }
        ])
        .exec();
        const publishedWikis = [];
        publishedHistories.forEach(publishedHistory => {
            publishedWikis.push(publishedHistory.wikis[0]);
        });
        const editedHistories = await WikiHistoryModel
        .aggregate([
            {
                $match: { authorUserObjectId: user._id, changeDescription: { $ne: 'created wiki' }}
            },
            { 
                $group: { 
                    _id: '$wikiObjectId',
                    lastUpdated: { $max: '$updatedAt' }
                } 
            },
            {
                $sort: { lastUpdated: -1 }
            },
            {
                $lookup: {
                    from: 'wikis',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'wikis'
                }
            }
        ])
        .exec();
        const editedWikis = [];
        editedHistories.forEach(editedHistory => {
            editedWikis.push(editedHistory.wikis[0]);
        });
        return res.status(201).json({
            drafts: draftedWikis,
            published: publishedWikis,
            edits: editedWikis
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not get your stuff.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'getMyStuff',
            description: 'Could not get my stuff.'
        });
        await log.save();
        return;
    }
};