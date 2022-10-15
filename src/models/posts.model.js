const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
   title : {
      type: String,
      required: true
   },
   description : {
      type: String,
      required: true
   },
   image : {
      type: String,
      required: true
   },
   address : {
      type: String,
      required: true
   },

   // to add relations between posts and users collection
   // to tell mongoDb that this is a real mongo db id we add this type  
   creator : {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
   },


});

module.exports = mongoose.model('Post', postSchema);