// Modules
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/users.model');
const HttpError = require('../models/http-error.model');
const LocalStrategy = require('passport-local').Strategy;


// Setup
const verifyCallback = async (username, password, done) => {
   let foundUser;
   try {
      foundUser = await User.findOne({email : username});
   } catch (e) {
      const error = new HttpError('Sign In Failed , no Such User', 500);
      return done(error)
   }

   if(!foundUser) {
      const error = new HttpError('Sign In Failed , no Such User', 500);
      return done(error)
   }

   let isValidPassword = false;
   try {
      isValidPassword = await bcrypt.compare(password, foundUser.password);
   } catch (e) {
      const error = new HttpError('Sign In Failed , Please Check Your Password', 500);
      return done(error)
   }

   if(!isValidPassword) {
      const error = new HttpError('Sign In Failed , Please Check Your Password', 500);
      return done(error)
   }

   return done(null, foundUser, {message: 'Sign In Succesfully !'})
}

passport.serializeUser((User, done) => {
   done(null, User.id)
});

passport.deserializeUser( async (id, done) => {
   const foundUser = await User.findById(id);
   if(!foundUser) {
      throw new HttpError('No User Found')
   }
   done(null, foundUser)
});



// Strategies
const localStrategy = new LocalStrategy({usernameField: 'email'}, verifyCallback);

module.exports = {
   localStrategy
}



