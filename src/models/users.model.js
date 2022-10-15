const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      minlength: 8
   },
   image: {
      type: String,
      required: true
   },

   // same as users but we can have mutliple post so we wrap it

   posts : [{
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Post'
   }]
   
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);