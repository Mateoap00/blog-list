const morgan = require('morgan');
const logger = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line no-unused-vars
morgan.token('resJSON', (request, response) => {
    return JSON.stringify(request.body);
});

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :resJSON');

const unknownEndpoint = (request, response) => {
    logger.error('404 not found - unknown endpoint');
    response.status(404).send({ error: 'unknown endpoint' });
};

// Get token from authorization header
// eslint-disable-next-line no-unused-vars
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    } else {
        request.token = null;
    }
    next();
};

// Get user after token authorization
// eslint-disable-next-line no-unused-vars
const userExtractor = async (request, response, next) => {
    try {
        /* eslint-disable no-undef */
        const decodedToken = jwt.verify(request.token, process.env.SECRET);
        if (!decodedToken.id) {
            request.user = null;
        } else {
            request.user = await User.findById(decodedToken.id);
        }
        next();
    } catch (exception) {
        next(exception);
    }

};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformed content' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'Token missing or invalid'
        });
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'Token expired'
        });
    }
    next(error);

};

module.exports = {
    morganLogger,
    unknownEndpoint,
    tokenExtractor,
    userExtractor,
    errorHandler
};