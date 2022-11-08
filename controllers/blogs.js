const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');

// Blogs routes
blogsRouter.get('/info', (request, response) => {
    response.send('<h1>Blog List App </h1>');
});

blogsRouter.get('/', (request, response) => {
    Blog.find({})
        .then(blogs => {
            logger.info('Blogs: ', blogs);
            response.status(200).json(blogs);
        }).catch(error => logger.error(error.message));
});

blogsRouter.post('/', (request, response) => {
    const body = request.body;
    const newBlog = new Blog(body);

    newBlog.save()
        .then(() => {
            logger.info('Blog saved: ', newBlog);
            response.status(200).json(newBlog);
        }).catch(error => logger.error(error.message));
});

module.exports = blogsRouter;