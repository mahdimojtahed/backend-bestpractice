// Modules
const express = require('express');
const router = express.Router();

// Middlewares
const fileMiddleware = require('../middlewares/file-upload.middleware');

// Validators
const {
   addPostValidators,
   updatePostValidators
} = require('../utils/validations');;

// Controllers
const {
   httpGetPostByPostID,
   httpGetPostsByUserID,
   httpPostNewPost,
   httpPatchUpdatePost,
   httpDeletePost
} = require('../controllers/post.controllers');


// Routes //

// No Auth Needed Routes
router.get('/:postID', httpGetPostByPostID);
router.get('/user/:userID', httpGetPostsByUserID);

// Auth Needed Routes
router.post('/', fileMiddleware.single('image'), addPostValidators, httpPostNewPost);
router.patch('/:postID', updatePostValidators, httpPatchUpdatePost);
router.delete('/:postID', httpDeletePost);



module.exports = router;