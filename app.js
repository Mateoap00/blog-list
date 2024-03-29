/*
    BLOG LIST APP

    Exercise 4.2: I refactored the structure of the application, the index file before had inside the mongodb schema and model, the connection
    with the database, the request routes for get and post blogs, all of this parts now are divided into their own modules, also I added
    the utils directory with the config module, logger and some functions used as middleware. All this modules are used in the app.js file
    that is the express app itself, and in index.js now it's only exporting the module and starting the server with the express app.
*/

const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('Connecting to MongoDB...');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info('Connected to MongoDB!');
    } catch (exception) {
        logger.error('Failed to connect to MongoDB: ', exception.message);
    }
};

connectMongoDB();

app.use(cors());
app.use(express.json());
app.use(middleware.morganLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing');
    app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;