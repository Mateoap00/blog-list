const morgan = require('morgan');
const logger = require('./logger');

// eslint-disable-next-line no-unused-vars
morgan.token('resJSON', (request, response) => {
    return JSON.stringify(request.body);
});

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :resJSON');

const unknownEndpoint = (request, response) => {
    console.log('404 not found - unknown endpoint');
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed content' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }
    next(error);

};

module.exports = {
    morganLogger,
    unknownEndpoint,
    errorHandler
};