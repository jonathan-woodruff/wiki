const { config } = require('dotenv');
config();

module.exports = {
    PORT: process.env.PORT,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    SECRET: process.env.SECRET,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    STRIPE_KEY: process.env.STRIPE_KEY,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    APP_PASSWORD: process.env.APP_PASSWORD,
    PASSWORD_RESET_SECRET: process.env.PASSWORD_RESET_SECRET
};
