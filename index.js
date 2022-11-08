/*
    BLOG LIST APP

    Step 1: Initialize the project installing the necessary npm packages and creating the mongodb schema for the blogs.
    Connecting the express app to the database, and defining get and post routes handlers, then testing the routes with
    vs code rest client.
*/

const app = require('./app'); // Express app module.
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

// Start server
const server = http.createServer(app);
// Start listening
server.listen(config.PORT, () => {
    logger.info(`Server listening on port ${config.PORT}...`);
});