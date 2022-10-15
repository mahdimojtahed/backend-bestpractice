// Modules
const { startSession } = require('mongoose');
const { validator } = require('../utils/validations');
const fs = require('fs');

// Models
const HttpError = require('../models/http-error.model');
const Post = require('../models/posts.model');
const User = require('../models/users.model');


const handleGetPostByPostID = async (id) => {
   let post;
   try {
      post = await Post.findById(id)
   } catch (e) {
      const error = new HttpError('Something is Wrong ... ', 500)
      return error
   }
   if(!post) {
      const error = new HttpError('Could not find a Post with this id', 404)
      return error
   }

   return post.toObject( {getters: true} );
}

const handleGetPostsByUserID = async (id) => {
   let userWithPosts;
   try {
      userWithPosts = await User.findById(id).populate('posts');
   } catch (e) {
      const error = new HttpError('Something is Wrong finding Posts for this user ', 500)
      return error
   }
   if(!userWithPosts || !userWithPosts.posts.length === 0) {
      const error = new HttpError('Could not Find This user or The Provided user has not any Post !', 404);
      return error;
   }
   return userWithPosts.posts.map(post => post.toObject( {getters: true} ))
}

const handleAddPost = async (req) => {
   if(validator(req)) {return validator(req)}
   
   const { title , description , address , creator } = req.body;

         
   const createdPost = new Post({
      title,
      description,
      address,
      image: req.file.path,
      creator
   });

   let user;
   try {
      user = await User.findById(creator);
   } catch (e) {
      const error = new HttpError('failed', 404);
      return error;
   }

   if(!user) {
      const error = new HttpError('Could not find user', 404);
      return error;
   }



   const session = await startSession();
   try {
      // by using transaction if one of the operations fails , whole operation will be aborted 
      // and every changes will reverted
      await session.withTransaction( async () => {
         await createdPost.save(session);
         user.posts.push(createdPost);
         await user.save(session)
      })
      session.endSession();
      return createdPost.toObject( {getters: true});
   } catch (e) {
      const error = new HttpError('Failed to create a Post, try again later', 500)
      return error;
   }

}

const handleUpdatePost = async (req) => {
   if(validator(req)) {return validator(req)}

   const { title , description } = req.body;
   const {postID} = req.params;
   let userID;
   try {
      userID = req.user.id;
   } catch (e) {
      const error = new HttpError('You Need To login to Edit a Post', 500);
      return error;
   }
   
   
   let post; 
   try {
      post = await Post.findById(postID)
   } catch (e) {
      const error = new HttpError('Something is wrong , Can not Find Specified Post', 500);
      return error;
   }

   if(post.creator.toString() !== userID) {
      const error = new HttpError('This Post Is not belong to you You cannot edit', 401);
      return error;
   }

   post.title = title;
   post.description = description;

   try {
      await post.save();
   } catch (e) {
      const error = new HttpError('Could not Update Post', 500)
      return error;
   }
   
   return post.toObject( { getters: true} );
}

const handleDeletePost = async (req) => {
   // in here we taking a postID and at the same time we want to search in 
   // users collection and see which user has this post and make sure that post
   // is also deleted from that user => to do so we need populate method
   // with populate we can refer to a document stored in another collection and to work with 
   // data in that existance document of other collection

   const {postID} = req.params;

   let userID;
   try {
      userID = req.user.id;
   } catch (e) {
      const error = new HttpError('You Need To login to Edit a Post', 500);
      return error;
   }
   
   let post;
   try {
      post = await Post.findById(postID).populate('creator');
   } catch (e) {
      const error = new HttpError('Something went wrong , could not delete Post', 500);
      return error;
   }

   if(!post) {
      const error = new HttpError('No Post with that id exists', 404)
      return error;
   }

   if(post.creator.id !== userID) {
      const error = new HttpError('You are not allowed to delete this Post', 401);
      return error;
   }

   const session = await startSession();
   try {
      await session.withTransaction( async () => {
         await post.remove(session);
         post.creator.posts.pull(post);
         await post.creator.save(session);
      });
      session.endSession();
      fs.unlink(post.image, err => {console.log(err)});   
      return post.toObject( {getters: true});
   } catch (e) {
      const error = new HttpError('Failed to Delete the Post, try again later', 500)
      return error;
   }


}

module.exports = {
   handleGetPostByPostID,
   handleGetPostsByUserID,
   handleAddPost,
   handleUpdatePost,
   handleDeletePost,
}