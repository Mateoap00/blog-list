/*
    Exercise 4.17: For this exercise I refactored the blogs post route so when a new blog is send to be saved in the database
    it defines a user for that blog. Defining the user is made by getting the first user registered in the db and using it's
    id to reference when creating the new blog. Also I changed the get route for blogs so it shows the information of the user
    that made the blog post (using .populate), similar for the get route in the users controller, it shows the information of
    all the blogs that the user posted. (Check also files controllers/users.js).
*/

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
//const jwt = require('jsonwebtoken');

// Get token from authorization header
// const getTokenFrom = request => {
//     const authorization = request.get('authorization');
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7);
//     }
//     return null;
// };

// Blogs routes
blogsRouter.get('/info', (request, response) => {
    response.send('<h1>Blog List App </h1>');
});

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
        response.status(200).json(blogs);
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        if (blog) {
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
    try {
        // const token = getTokenFrom(request);
        // /* eslint-disable no-undef */
        // const decodedToken = jwt.verify(token, process.env.SECRET);

        // if (!decodedToken.id) {
        //     return response.status(401).json({ error: 'token missing or invalid' });
        // }

        //const user = await User.findById(decodedToken.id);

        const user = await User.findOne({});

        const newBlog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        });
        const savedBlog = await newBlog.save();
        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();
        response.status(201).json(savedBlog);
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blogDeleted = await Blog.findByIdAndRemove(request.params.id);
        if (!blogDeleted) {
            response.status(404).end();
        } else {
            response.status(204).end();
        }
    } catch (exception) {
        next(exception);
    }
});

blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body;

    //const opt = { new: true, runValidators: true, context: 'query' };
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true });
        if (!updatedBlog) {
            response.status(404).end();
        } else {
            response.status(200).json(updatedBlog);
        }
    } catch (exception) {
        next(exception);
    }
});

module.exports = blogsRouter;