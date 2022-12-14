const Blog = require('../models/blog');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const initialBlogs = [
    {
        title: 'Blog test 1',
        author: 'Mateo',
        url: 'www.blogtest1.com',
        likes: 10,
    },
    {
        title: 'Blog test 2',
        author: 'Melina',
        url: 'www.blogtest2.com',
        likes: 7,
    },
    {
        title: 'Blog test 3',
        author: 'Leslie',
        url: 'www.blogtest3.com',
        likes: 8
    }
];

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Blog test to be removed',
        author: 'Mateo',
        url: 'www.blogtest.com',
        likes: 15
    });

    const id = blog._id.toString();
    await blog.save();
    await blog.remove();
    return id;
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

const generateAuthHeader = async () => {
    const response = await api
        .post('/api/login')
        .send({
            username: 'rootUser',
            password: 'sekret'
        });
    const token = response.body.token;
    const auth = 'bearer ' + token;
    return auth;
};

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
    generateAuthHeader
};