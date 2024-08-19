const mongoose = require('mongoose');
const { MONGO_URL, DB_NAME } = require('../constants/index');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose 
    .connect(MONGO_URL, {

    })   
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
  }
}

module.exports = new Database();