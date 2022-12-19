const Blog = require('../models/blog');

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
    await blog.save();
    await blog.remove();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
};