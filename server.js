// Requirements
const http = require('http');
const app = require('./src/app');
const {dbConnect} = require('./src/config/mongo.config');

// Functions
const server = http.createServer(app);

// Configuration
require('dotenv').config();
const config = {
   PORT: process.env.PORT,
}

// Run-Server Functions
async function createServer() {
   await dbConnect()
   server.listen(config.PORT, () => {
      console.log(`Server is Listening to Port ${config.PORT} ... `)
   });
}

createServer();