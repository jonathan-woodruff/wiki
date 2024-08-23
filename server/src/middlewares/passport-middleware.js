const passport = require('passport');
const { Strategy } = require('passport-jwt');
const { SECRET } = require('../constants/index');
const db = require('../db/index');
const UserModel = require('../models/user');

//check if the user sends a cookie called token. If so, return the token
const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const opts = {
    secretOrKey: SECRET,
    jwtFromRequest: cookieExtractor
};

passport.use(
    new Strategy(opts, async ({ email }, done) => { //use the email from the token payload
        try {
            const user = await UserModel.findOne({ email: email }).exec();
            if (!user) {
                throw new Error('401 not authorized');
            };
            return await done(null, user);
        } catch(error) {
            console.log(error.message);
            done(null, false);
        }
    })
);

