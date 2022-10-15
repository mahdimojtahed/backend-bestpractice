// Modules
const fs = require("fs");
const HttpError = require("../models/http-error.model");

const noRouteErrorHandler = (req, res, next) => {
  const error = new HttpError(
    "Could not Found this route on the server !",
    404
  );
  return next(error);
};

const inRoutesErrorHandler = (error, req, res, next) => {
  // we want to roll back changes if there is an error and a file saved so
  // we delete the file
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ error: error.message } || "An Unknown Error Happened !");
};

module.exports = {
  noRouteErrorHandler,
  inRoutesErrorHandler,
};
