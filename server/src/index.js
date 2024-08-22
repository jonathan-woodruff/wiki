const express = require('express');
const app = express();
const { PORT, CLIENT_URL } = require('./constants/index');
const cors = require('cors');

require('./db'); 

app.use(express.json()); //parses incoming requests with JSON payloads and enables you to use req.body
app.use(cors({ origin: CLIENT_URL, credentials: true })); //credentials: true will allow the client to send the cookie containing user credentials
//https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node
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