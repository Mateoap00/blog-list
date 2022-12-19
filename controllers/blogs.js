const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const logger = require('../utils/logger');

// Blogs routes
blogsRouter.get('/info', (request, response) => {
    response.send('<h1>Blog List App </h1>');
});

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({});
        response.status(200).json(blogs);
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        if (blog) {
            logger.info('Blog found: ', blog);
            response.status(200).json(blog);
        } else {
            response.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body;
    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    });

    try {
        const savedBlog = await newBlog.save();
        logger.info('Blog saved: ', savedBlog);
        response.status(201).json(savedBlog);
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id);
        logger.info('Deleted successfully!');
        response.status(204).end();
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body;

    //const opt = { new: true, runValidators: true, context: 'query' };
    try {
        const updatedNote = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes });
        logger.info('Updated note: ', updatedNote);
        response.status(200).json(updatedNote);
    } catch (exception) {
        next(exception);
    }
});

module.exports = blogsRouter;