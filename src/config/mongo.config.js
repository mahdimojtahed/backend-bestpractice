const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const config = {
   MONGO_URI: process.env.MONGO_URI
}


const dbConnect = async () => {
   await mongoose
      .connect(config.MONGO_URI, {})
      .then(console.log('Connection to DB Stablished ...'))
      .catch(err => console.log(err))
}

const sessionStore = new MongoStore({
   mongoUrl: config.MONGO_URI,
   collectionName: 'sessions'
});

module.exports = {dbConnect, sessionStore};