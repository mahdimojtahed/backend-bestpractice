// Handlers
const {
   handleGetPostByPostID,
   handleGetPostsByUserID,
   handleAddPost,
   handleUpdatePost,
   handleDeletePost
} = require('../handlers/post-requests.handlers');

// Controllers
const httpGetPostByPostID = async (req, res, next) => {
   const result = await handleGetPostByPostID(req.params.postID);
   if(result.code) { return next(result) }
   res.json(result);
} 

const httpGetPostsByUserID = async (req, res, next) => {
   const result = await handleGetPostsByUserID(req.params.userID);
   if(result.code) { return next(result) }
   res.json(result);
}

const httpPostNewPost = async (req, res, next) => {
   const result = await handleAddPost(req);
   if(result.code) { return next(result) };
   res.json(result);
}

const httpPatchUpdatePost = async (req, res, next) => {   
   const result = await handleUpdatePost(req);
   if(result.code) { return next(result) };
   res.json(result);
}

const httpDeletePost = async (req, res, next) => {
   let result = await handleDeletePost(req);
   if(result.code) { return next(result) }
   res.json(result);
}

module.exports = {
   httpGetPostByPostID,
   httpGetPostsByUserID,
   httpPostNewPost,
   httpPatchUpdatePost,
   httpDeletePost
}