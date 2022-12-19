/*
    Exercise 4.8: In this exercise I wrote a jest test to check if the http get request to the MongoDB database works properly
    and returns the blogs saved in a JSON format. I'm using a new database for the tests in which I can safely make crud
    operations without worrying about the state of the real application's db. Also I refactored the router code so the GET
    handler uses the syntax async/await.

    Exercise 4.9*: Here I wrote a jest test to verify that every blog in the db has a defined id property when a GET request is
    made and the response uses json format.

    Exercise 4.10: For this exercise I wrote a test that checks that a new blog is saved correctly when a POST request is made,
    for this the test checks that the size of the blogs in the db increased by 1 and then it checks that the title, url, author
    and likes of the new blog are all contained it the db. After this I refactored the POST handler in the router so it uses the
    syntax async/await.

    Exercise 4.11*: Here I wrote a jest test to check that if a new blog doesn't have a likes property defined, then it's likes
    defaults to 0, for this I used expect.toEqual() to verify that the likes value is in fact 0 and in the MongoDB Schema I defined
    the likes with a default value of 0.

    Exercise 4.12*: In this exercise I wrote a test to check that if a blog doesn't have a defined title and a defined url, then
    it won't be saved to the db. For this I changed the MongoDB schema of the blogs so the title and url are both required and if
    a POST request tries to save a blog without this then the error handler middleware responds with a 400 error code, so the test
    expects this response.
*/

const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test('Blogs are returned as json with HTTP GET request', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('Blogs have a unique identifier named id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    for (let blog of blogs) {
        expect(blog.id).toBeDefined();
    }
});

test('A new blog can be added with HTTP POST request', async () => {
    const newBlog = {
        title: 'Blog test 4',
        author: 'Pablo',
        url: 'www.blogtest4.com',
        likes: 5
    };
    await api.post('/api/blogs').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    const response = await api.get('/api/blogs');
    const blogsAtEnd = response.body;
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const newBlogId = blogsAtEnd[helper.initialBlogs.length].id;
    expect(blogsAtEnd).toContainEqual({ ...newBlog, id: newBlogId });
});

test('A new blog without a likes property has 0 likes by default when a HTTP POST request is made', async () => {
    const newBlog = {
        title: 'Blog test 5',
        author: 'Mateo',
        url: 'www.blogtest5.com'
    };
    const response = await api.post('/api/blogs').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    console.log(response.body);

    expect(response.body.likes).toEqual(0);
});

test('A blog without title or url is not added when making a HTTP POST request', async () => {
    let newBlog = {
        author: 'Luis',
        url: 'www.blogtest6.com',
        likes: 2
    };
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(400);
    let response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);

    newBlog = {
        title: 'Blog test 7',
        author: 'Melina',
        likes: 10
    };
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);
    response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

// test('The first blog\'s url is in the DB', async () => {
//     const blogsAtEnd = await helper.blogsInDb();
//     const urls = blogsAtEnd.map(blog => blog.url);
//     expect(urls).toContain('www.blogtest1.com');
// });

// test('A specific blog can be viewed', async () => {
//     const blogsAtStart = await helper.blogsInDb();

//     const blogToView = blogsAtStart[0];

//     const resultBlog = await api
//         .get(`/api/blogs/${blogToView.id}`)
//         .expect(200)
//         .expect('Content-Type', /application\/json/);

//     const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

//     expect(resultBlog.body).toEqual(processedBlogToView);
// });

// test('A blog can be deleted', async () => {
//     const blogsAtStart = await helper.blogsInDb();
//     const blogToDelete = blogsAtStart[0];

//     await api
//         .delete(`/api/blogs/${blogToDelete.id}`)
//         .expect(204);

//     const blogsAtEnd = await helper.blogsInDb();

//     expect(blogsAtEnd).toHaveLength(
//         helper.initialBlogs.length - 1
//     );

//     const titles = blogsAtEnd.map(blog => blog.title);

//     expect(titles).not.toContain(blogToDelete.title);
// });

afterAll(() => {
    mongoose.connection.close();
});