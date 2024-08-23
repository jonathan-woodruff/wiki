const passport = require('passport');

//now every time you use userAuth on a route, the route will be protected by the jwt token
//then req.user will be set to the authenticated user
//note you are not using a session because in each request you are extracting the cookie which contains the necessary data (user id) to authorize the user
exports.userAuth = passport.authenticate('jwt', { session: false });