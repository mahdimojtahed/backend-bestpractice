// Modules
const { sessionMiddleware } = require("./middlewares/sessions-middleware");
const express = require("express");
const helmet = require("helmet");
const path = require("path");

// Passport Modules
const passport = require("passport");
const { localStrategy } = require("./config/passport.config");

// Routers
const postsRouter = require("./routes/post.routes");
const usersRouter = require("./routes/user.routes");

// Controllers
const {
  noRouteErrorHandler,
  inRoutesErrorHandler,
} = require("./handlers/error.handlers");

// Middlewares
const app = express();
app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Authentication"
  );
  next();
});

// Sessions and Cookies
app.use(sessionMiddleware);
app.use(passport.session());

// Passport Authentication
app.use(passport.initialize());
passport.use(localStrategy);

// Routes
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "/..", "/uploads", "/images"))
);

// Error Handling
app.use(noRouteErrorHandler);
app.use(inRoutesErrorHandler);

module.exports = app;
