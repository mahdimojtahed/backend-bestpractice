// Modules
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error.model');


// Posts Validators
const addPostValidators = [
   check('title').not().isEmpty(),
   check('description').isLength({min: 10}),
   check('address').not().isEmpty()
]

const updatePostValidators = [
   check('title').not().isEmpty(),
   check('description').isLength({min: 10})
]

// Users Validators
const signUpUserValidators = [
   check('name').not().isEmpty(),
   check('email').normalizeEmail().isEmail(),
   check('password').isLength({min: 8})
]

// Validator
const validator = (req) => {
   const results = validationResult(req)
   if(!results.isEmpty()) {
      let errorText = '';
      results.errors.forEach(errorObj => {
         const param = errorObj.param
         errorText = `${errorText}${param} `
      });
      const error = new HttpError(`Please Check your inputs : ${errorText}`, 422);
      return error
   }
   return null
}

module.exports = {
   validator,
   addPostValidators,
   updatePostValidators,
   signUpUserValidators,
}