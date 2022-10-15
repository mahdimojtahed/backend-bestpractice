// Handlers
const {
   handleGetUsers,
   handleUserSignUp,
   handleUserSignInResponse,
   handleUserSignOut,
   handleCheckUserSession,
} = require('../handlers/user-requests.handlers');

// Controllers
const httpGetUsers = async (req, res, next) => {
   const result = await handleGetUsers();
   res.json(result);
};

const httpPostSingUp = async (req, res, next) => {
   const result = await handleUserSignUp(req);
   if(result.code){ return next(result) }
   res.json(result);
};

const httpPostSignIn = async (req, res, next) => {
   const result = await handleUserSignInResponse(req);
   if(result.code){ return next(result) }
   res.json(result);
};

const httpPostSignOut = async (req, res, next) => {
   const result = await handleUserSignOut(req);
   if(result.code){ return next(result) }
   res.json(result);
};

const httpCheckSession = async (req, res, next) => {
   const result = await handleCheckUserSession(req);
   res.json(result);
};

module.exports = {
   httpGetUsers,
   httpPostSingUp,
   httpPostSignIn,
   httpPostSignOut,
   httpCheckSession
}