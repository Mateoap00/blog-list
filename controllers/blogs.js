/*
    Exercise 4.17: For this exercise I refactored the blogs post route so when a new blog is send to be saved in the database
    it defines a user for that blog. Defining the user is made by getting the first user registered in the db and using it's
    id to reference when creating the new blog. Also I changed the get route for blogs so it shows the information of the user
    that made the blog post (using .populate), similar for the get route in the users controller, it shows the information of
    all the blogs that the user posted. (Check also files controllers/users.js).

    Exercise 4.19: Here I refactored the blogs post route so it only saves a blog if a authenticated token exists. For this
    I check in the request object, the authorization header with a helper function (getTokenFrom), this function only returns
    the token if there's any, if not then returns null, after that in the post route I used the jsonwebtoken package to decode
    the token (if possible, if not then returns a 401 error status). Once the token is decoded then it checks for the id of
    the user (so it verifies that the user is logged in), then the route functions as before, looks for the user using it's
    id and it to references it when creating the new blog.

    Exercise 4.20*: In this exercise I moved yhe getTokenFrom helper function to the middleware so every time request are made
    it checks if a user is logged in (checks for a valid token), in this case I'm using before passing to the post route so the
    token from the authorization header is passed to the token field in the request object so when decoding, the token can be
    accessed from request.token. (Check also files utils/middleware.js).

    Exercise 4.21*: For this exercise I refactored the delete route handler for blogs, now it checks first if the user that
    created the blog in the first place is logged in, and only then it proceeds to delete de blog, so a user can't delete
    others users' blogs. I'm checking the token of the logged in user and decoding it so then I can compare the id of the user
    with the id of the user referenced in the blog's field 'user'. Also I added validation for use cases when the blog isn't
    found, the token is not valid and the user logged in is not the one that created the blog.

    Exercise 4.22*: Here I wrote a new middleware function that works as a user extractor after the token extractor middleware
    gets saved in the request.token field, so with this field then the new middleware finds the user in the database that is
    logged in, if it doesn't find it then the field request.user is null, so then the routes for post and delete can't be
    executed since there's no user logged in, then the status response code is 401 unauthorized. If the middleware finds the
    user then the routes continue with the proper execution, taking the user from request.user field. This new userExtractor
    middleware is executed only in the route /api/blogs before the post and delete routes handlers.

    TO-DO: Comment 4.21* and finish exercises 4.22* and 4.23*.
*/

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');
//const User = require('../models/user');
//const jwt = require('jsonwebtoken');


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

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body;
    try {
        if (request.user === null) {
            return response.status(401).json({ error: 'Token missing or invalid' });
        }
        const user = request.user;

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        if (request.user === null) {
            return response.status(401).json({ error: 'Token missing or invalid' });
        }
        const user = request.user;

        const blogToBeDeleted = await Blog.findById(request.params.id);
        if (!blogToBeDeleted) {
            return response.status(404).json({ error: 'Blog not found' });
        }

        if (blogToBeDeleted.user.toString() !== user._id.toString()) {
            return response.status(401).json({ error: 'Wrong user logged in' });
        }

        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();

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