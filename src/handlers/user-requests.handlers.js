// Modules
const { validator } = require('../utils/validations');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const passport = require('passport');

// Models
const HttpError = require('../models/http-error.model');
const User = require('../models/users.model');


const handleGetUsers = async () => {
   let users;
   try {
      users = await User.find({}, '-password');
   } catch (e) {
      const error = new HttpError('Something is wrong , please try again ', 500);
      return error;
   }

   return ({users: users.map(user => user.toObject( {getters: true} ))})
};

const handleUserSignUp = async (req) => {
   if(validator(req)) {return validator(req)}
   const { name , email , password } = req.body;

   let existingUser;
   try {
      existingUser = await User.findOne({ email: email })
   } catch (e) {
      const error = new HttpError('Signup failed , please try again later !', 500)
      return error;  
   }

   if(existingUser) {
      const error = new HttpError('User already registered !', 422)
      return error;
   }

   let hashedPass;
   try {
      hashedPass = await bcrypt.hash(password, 12);
   } catch (e) {
      const error = new HttpError('Could Not Create User', 500);
      return error;
   }

   const createdUser = new User({
      name,
      email,
      password: hashedPass,
      posts: [],
      image: req.file.path,
   });


   try {
      await createdUser.save()
   } catch (e) {
      const error = new HttpError('Can not Save User to database', 500)
      return error;
   }

   req.login( createdUser, (err) => {
      if(err) {
         const error = new HttpError('kir', 500);
         return error;
      }
   });
   
   return {userID: createdUser.id, email: createdUser.email};
};



const handleUserSignInResponse = async (req) => {
   let id,email;
   try {
      id = req.user.id;
      email = req.user.email;
   } catch (e) {
      const error = new HttpError('Something Is Wrong , Please Try Again Later', 500);
      return error;
   }
   
   return {userID: id, email: email }
   
};

const handleUserSignOut = async (req) => {
   req.logout((err) => {
      if(err) {
         const error = new HttpError('Could Not Sign Out', 500)
         return error;
      }
   })
   
   return {message : 'Signed Out Successfully'}
};


const handleCheckUserSession = async (req) => {
   if(req.user) {
      return {userID: req.user.id, email: req.user.email}
   }  
}



module.exports = {
   handleGetUsers,
   handleUserSignUp,
   handleUserSignInResponse,
   handleUserSignOut,
   handleCheckUserSession,
}