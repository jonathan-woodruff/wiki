const { UserModel, WikisModel, WikiHistoryModel, CommunityModel } = require('../models/index');
const { parseServices } = require('../utils/index');
const path = require('path');
const fs = require('fs');
const { STRIPE_KEY, EMAIL_ADDRESS, APP_PASSWORD } = require('../constants/index');
const stripe = require('stripe')(STRIPE_KEY);
const nodemailer = require('nodemailer');

exports.postWiki = async (req, res) => {
    const user = req.user;
    try {
        const country = req.body.country;
        const sector = req.body.sector;
        const title = req.body.title;
        const contentTime = req.body.article.time;
        const contentBlocks = req.body.article.blocks;
        const contentVersion = req.body.article.version;
        const newWiki = new WikisModel({
            country: country,
            sector: sector,
            title: title,
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        const savedWiki = await newWiki.save();
        try {
            // post to the wiki history model
            const newWikiHistory = new WikiHistoryModel({
                wikiId: savedWiki._id,
                authorUserId: user._id,
                wikiObjectId: savedWiki._id,
                authorUserObjectId: user._id,
                changeDescription: 'created wiki',
                contentTime: contentTime,
                contentBlocks: contentBlocks,
                contentVersion: contentVersion
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
                    functionName: 'postWiki',
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
                functionName: 'postWiki',
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
            functionName: 'postWiki',
            description: 'Could not save wiki.'
        });
        await log.save();
        return;
    }
    /*newWiki.save()
    .then((savedWiki) => {
        // post to the wiki history model
        const user = req.user;
        const newWikiHistory = new WikiHistoryModel({
            wikiId: savedWiki._id,
            authorUserId: user._id,
            wikiObjectId: savedWiki._id,
            authorUserObjectId: user._id,
            changeDescription: 'created wiki',
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        newWikiHistory.save()
        .then(() => {
            // update the user model 
            user.wikisCreated++;
            user.save()
            .then(() => {
                return res.status(201).json({
                    wikiID: savedWiki._id
                });
            })
            .catch(() => {
                return res.status(500).json({
                    error: 'Server error: Could not update your user stats.'
                });
            })
        })
        .catch(() => {
            return res.status(500).json({
                error: 'Server error: Could not save wiki history.'
            });
        })
    })
    .catch(() => {
        return res.status(500).json({
            error: 'Server error: Could not save wiki.'
        });
    })*/
    /*try {
        // post to the wiki model 
        const newWiki = new WikisModel({
            country: country,
            sector: sector,
            title: title,
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        const savedWiki = await newWiki.save();

        // post to the wiki history model
        const user = req.user; //await UserModel.findOne({ email: req.user.email }).exec();
        const newWikiHistory = new WikiHistoryModel({
            wikiId: savedWiki._id,
            authorUserId: user._id,
            wikiObjectId: savedWiki._id,
            authorUserObjectId: user._id,
            changeDescription: 'created wiki',
            contentTime: contentTime,
            contentBlocks: contentBlocks,
            contentVersion: contentVersion
        });
        await newWikiHistory.save();

        // update the user model 
        user.wikisCreated++;
        await user.save();

        return res.status(201).json({
            wikiID: savedWiki._id
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not save wiki properly.'
        });
    }*/
};

exports.getWikis = async (req, res) => {
    try {
        const country = req.query.country;
        const sector = req.query.sector;
        let wikis;
        if (country === 'All' && sector === 'All') {
            wikis = await WikisModel.find().sort({ 'updatedAt': -1 }).exec();
        } else if (country === 'All') {
            wikis = await WikisModel.find({ sector: sector }).sort({ 'updatedAt': -1 }).exec();
        } else if (sector === 'All') {
            wikis = await WikisModel.find({ country: country }).sort({ 'updatedAt': -1 }).exec();
        } else { //both country and sector are selected to be filtered
            wikis = await WikisModel.find({ country: country, sector: sector }).sort({ 'updatedAt': -1 }).exec();
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
        //const avatarPath = path.resolve(`./public/avatars/${user.photo}`);
        //const base64Avatar = fs.readFileSync(avatarPath, { encoding: 'base64' })
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

exports.postAvatar = async (req, res) => {
    const user = req.user; //await UserModel.findOne({ email: req.user.email }).exec();
    try {
        user.photo = req.file.filename;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'updated avatar'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not save profile pic.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'postAvatar',
            description: 'Could not save profile pic.'
        });
        await log.save();
        return;
    }
};

exports.updateProfile = async (req, res) => {
    const user = req.user; //await UserModel.findOne({ email: req.user.email }).exec();
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
    if (user) {
        const [countries, sectors] = parseServices(user.services);
        return res.status(200).json({
            countries: countries,
            sectors: sectors
        });
    } else {
        res.status(500).json({
            error: 'Server error: Could not load data.'
        });
        const log = new ErrorLogModel({
            userId: user._id || '',
            email: user.email || '',
            functionName: 'getCreatedWikiData',
            description: 'Could not load data.'
        });
        await log.save();
        return;
    }
};

exports.getWikiByID = async (req, res) => {
    const wikiID = req.query.wiki;
    const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
    if (wiki) {
        return res.status(200).json({
            wiki: wiki
        });
    } else {
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
                res.status(200).json({
                    success: true,
                    message: 'updated wiki'
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
    /*WikisModel.findOne({ _id: wikiId }).exec()
    .then((wiki) => {
        wiki.contentTime = contentTime;
        wiki.contentBlocks = contentBlocks;
        wiki.contentVersion = contentVersion;
        wiki.save()
        .then(() => {
            // add the wiki version to the wiki history model
            const user = req.user;
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
            newWikiEdit.save()
            .then(() => {
                // update the user model
                user.wikiEdits++;
                user.save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: 'updated wiki'
                    });
                })
                .catch(() => {
                    return res.status(500).json({
                        error: 'Server error: Could not save your user stats.'
                    });
                })
            })
            .catch(() => {
                return res.status(500).json({
                    error: 'Server error: Could not save wiki history.'
                });
            })
        })
        .catch(() => {
            return res.status(500).json({
                error: 'Server error: Could not save wiki.'
            });
        })
    })
    .catch(() => {
        return res.status(500).json({
            error: 'Server error: Could not find wiki.'
        });
    })*/
    /*try {
        // update the wiki in the wikis model
        const wiki = await WikisModel.findOne({ _id: wikiId }).exec();
        wiki.contentTime = contentTime;
        wiki.contentBlocks = contentBlocks;
        wiki.contentVersion = contentVersion;
        await wiki.save();
        // add the wiki version to the wiki history model
        const user = req.user; //await UserModel.findOne({ email: req.user.email }).exec();
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
        // update the user model
        user.wikiEdits++;
        user.save();
        return res.status(200).json({
            success: true,
            message: 'updated wiki'
        });
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not save your edits.'
        });
    }*/
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
    /*const wikiID = req.query.wiki;
    WikisModel.findOne({ _id: wikiID }).exec()
    .then((wiki) => {
        WikiHistoryModel
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
        .exec()
        .then((wikiHistory) => {
            if (wiki && wikiHistory.length) {
                return res.status(200).json({
                    wiki: wiki,
                    wikiHistory: wikiHistory
                });
            } else {
                return res.status(500).json({
                    error: 'Server error: Could not load wiki history.'
                })
            }
        })
        .catch(() => {
            return res.status(500).json({
                error: 'Server error: Could not find wiki history.'
            })
        })
    })
    .catch(() => {
        return res.status(500).json({
            error: 'Server error: Could not find wiki.'
        })
    })*/
    /*try {
        const wikiID = req.query.wiki;
        const wiki = await WikisModel.findOne({ _id: wikiID }).exec();
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
        }
    } catch(error) {
        res.status(500).json({
            error: 'Server error: Could not load wiki history.'
        })
    }*/
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
    if (wikiHistory) {
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
            description: 'Could not load historical data.'
        });
        await log.save();
        return;
    }
};

exports.postCommunity = async (req, res) => {
    const user = req.user;
    try {
        //const user = await UserModel.findOne({ email: req.user.email }).exec();
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