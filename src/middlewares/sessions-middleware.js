const {sessionStore} = require('../config/mongo.config');
const sessions = require('express-session');

const config = {
   SESSION_SECRET: process.env.SESSION_SECRET
}


const sessionMiddleware = sessions({
   secret: config.SESSION_SECRET,
   saveUninitialized: false,
   store: sessionStore,
   reasve: false,
   cookie: { maxAge: 1000 * 60 * 60} // 1hour
});


module.exports = {
   sessionMiddleware
}
