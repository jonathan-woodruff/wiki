const express = require('express');
const app = express();
const { PORT, CLIENT_URL } = require('./constants/index');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');

require('./db'); 

//import passport middleware strategies
require('./middlewares/passport-middleware');

app.use(express.json({ limit: '2mb' })); //parses incoming requests with JSON payloads and enables you to use req.body
app.use(express.urlencoded({ limit: '2mb', extended: true })); 
app.use(cookieParser()); //gives you access to req.cookies or req.signedCookies
app.use(cors({ origin: CLIENT_URL, credentials: true })); //credentials: true will allow the client to send the cookie containing user credentials
app.use(passport.initialize());

//import routes
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');

//initialize routes
app.use('/auth', authRoutes);
app.use('/main', mainRoutes);

//app start
const appStart = () => {
    try {
        app.listen(PORT, () => {
            console.log(`The app is running at http://localhost:${PORT} `)
        })
    } catch(error) {
        console.log(`Error: ${error.message}`)
    }
};

appStart();