// Modules 
const passport = require('passport');
const express = require('express');
const router = express.Router();

// MiddleWares
const fileMiddleware = require('../middlewares/file-upload.middleware');

// Validators 
const {
   signUpUserValidators
} = require('../utils/validations.js');

// Controllers 
const {
   httpGetUsers,
   httpPostSingUp,
   httpPostSignIn,
   httpPostSignOut,
   httpCheckSession
} = require('../controllers/user.controller');



// Routes
router.get('/', httpGetUsers);
router.get('/check', httpCheckSession)
router.post('/signup', fileMiddleware.single('image'), signUpUserValidators, httpPostSingUp);
router.post('/signin', passport.authenticate('local') , httpPostSignIn);
router.get('/signout', httpPostSignOut);

module.exports = router;
