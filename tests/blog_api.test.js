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

    Exercise 4.13 and 4.14: In this exercises I wrote jest tests to check that a blog is deleted successfully when a request is made,
    also I wrote tests to check that if the request sends an id of a deleted or non existing blog, then the response status is correct,
    and a last test to check if the id is incorrect. For the exercise 4.14 I wrote tests that are similar to the ones explained before
    but to check that a blog is updated correctly, this happens when the id and the blog is already in the db, if the id is valid but
    of a non existing blog or if the id is invalid, then the proper status code is send. I refactored the delete and put route handlers
    to use the syntax async/await and all the tests were organized in groups based on the logic that the test is checking (initial state
    of the test database, get, post, delete and update requests).

    Exercise 4.23*: For this exercise I refactored all the post and delete request tests so now they work with token authentication, also
    I wrote in the beforeEach() part of this test suit that a new root user is created and saved in the database, also all the blogs that
    are in the helper.initialBlogs get saved to the db with post requests instead of directly saving it with the mongoose model. To
    generate the tokens for the post and delete tests I'm using a helper function that logs in as the root user and returns the generated
    token. Lastly I added two tests that verify that a blog can't be posted or deleted if the authentication token is invalid.
    (Check also files tests/test_helper.js).
*/

const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog');
const User = require('../models/user');
const app = require('../app');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');

const api = supertest(app);

jest.setTimeout(10000);

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'rootUser', name: 'Root User', passwordHash });
    await user.save();

    for (let blog of helper.initialBlogs) {
        await api.post('/api/blogs')
            .set('Authorization', await helper.generateAuthHeader())
            .send(blog);
    }
});

describe('When there is initially blogs saved', () => {
    test('Blogs are returned as json with HTTP GET request (200)', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('All blogs are returned', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test('Blogs have a unique identifier named id', async () => {
        const response = await api.get('/api/blogs');
        const blogs = response.body;
        for (let blog of blogs) {
            expect(blog.id).toBeDefined();
        }
    });

    test('A specific blog is within the returned blogs', async () => {
        const blogs = await helper.blogsInDb();
        const titles = blogs.map(b => b.title);
        expect(titles).toContain('Blog test 1');
    });

});

describe('Viewing a specific blog', () => {
    test('Success with a valid id (200)', async () => {
        const blogsAtStart = await helper.blogsInDb();

        const blogToView = blogsAtStart[0];

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

        expect(resultBlog.body).toEqual(processedBlogToView);
    });

    test('Fails with a id of a non existing or deleted blog (404)', async () => {
        const nonExistingId = await helper.nonExistingId();

        await api.get(`/api/blogs/${nonExistingId}`)
            .expect(404);
    });

    test('Fails with a invalid id (400)', async () => {
        const falseID = '5a3d5da59070081a82a3445';
        await api
            .get(`/api/blogs/${falseID}`)
            .expect(400);
    });

});

describe('Adding a new blog', () => {
    test('A new blog can be added with HTTP POST request if authorized (201)', async () => {
        const newBlog = {
            title: 'Blog test 4',
            author: 'Pablo',
            url: 'www.blogtest4.com',
            likes: 5
        };

        await api.post('/api/blogs')
            .set('Authorization', await helper.generateAuthHeader())
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
        const titles = blogsAtEnd.map(b => b.title);
        expect(titles).toContain('Blog test 4');
    });

    test('A new blog without a likes property has 0 likes by default when a authorized HTTP POST request is made (201)', async () => {
        const newBlog = {
            title: 'Blog test 5',
            author: 'Mateo',
            url: 'www.blogtest5.com'
        };

        const blogAdded = await api.post('/api/blogs')
            .set('Authorization', await helper.generateAuthHeader())
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        expect(blogAdded.body.likes).toEqual(0);
    });

    test('A blog without title or url is not added when making a authorized HTTP POST request (400)', async () => {
        let newBlog = {
            author: 'Luis',
            url: 'www.blogtest6.com',
            likes: 2
        };
        await api.post('/api/blogs')
            .set('Authorization', await helper.generateAuthHeader())
            .send(newBlog)
            .expect(400);
        let blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

        newBlog = {
            title: 'Blog test 7',
            author: 'Melina',
            likes: 10
        };
        await api.post('/api/blogs')
            .set('Authorization', await helper.generateAuthHeader())
            .send(newBlog)
            .expect(400);
        blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

    test('A blog is not added when making a HTTP POST request if an authorized token is not provided (401)', async () => {
        const newBlog = {
            title: 'Blog test that won\'t be added',
            author: 'Pablo',
            url: 'www.falseblogtest.com',
            likes: 10
        };
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(401);
        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

});

describe('Deleting a blog', () => {
    test('A blog can be deleted if an authorized token is provided (204)', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', await helper.generateAuthHeader())
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

        const titles = blogsAtEnd.map(blog => blog.title);

        expect(titles).not.toContain(blogToDelete.title);
    });

    test('Fails to delete with a id of a non existing or deleted blog (404)', async () => {
        const nonExistingId = await helper.nonExistingId();

        await api.delete(`/api/blogs/${nonExistingId}`)
            .set('Authorization', await helper.generateAuthHeader())
            .expect(404);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

    test('Fails to delete with a invalid id (400)', async () => {
        const falseID = '5a3d5da59070081a82a3445';
        await api
            .delete(`/api/blogs/${falseID}`)
            .set('Authorization', await helper.generateAuthHeader())
            .expect(400);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

    test('Fails to delete if an authorized token is not provided (401)', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

});

describe('Updating a blog', () => {
    test('A blog can be updated (200)', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        const toUpdateWith = {
            title: 'Blog test 1 updated',
            author: 'Mateo',
            url: 'www.blogtest1.0.com',
            likes: 20,
            user: blogToUpdate.user
        };

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', await helper.generateAuthHeader())
            .send(toUpdateWith)
            .expect(200);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

        const titles = blogsAtEnd.map(blog => blog.title);

        expect(titles).toContain(toUpdateWith.title);
        expect(titles).not.toContain(blogToUpdate.title);
    });

    test('Fails to update with a id of a non existing or deleted blog (404)', async () => {
        const nonExistingId = await helper.nonExistingId();
        const toUpdateWith = {
            title: 'Blog test 1 updated',
            author: 'Mateo',
            url: 'www.blogtest1.0.com',
            likes: 20,
        };

        await api.put(`/api/blogs/${nonExistingId}`)
            .set('Authorization', await helper.generateAuthHeader())
            .send(toUpdateWith)
            .expect(404);

        const blogsAtEnd = await helper.blogsInDb();
        const titles = blogsAtEnd.map(blog => blog.title);
        expect(titles).not.toContain(toUpdateWith.title);
    });

    test('Fails to update with a invalid id (400)', async () => {
        const falseID = '5a3d5da59070081a82a3445';
        const toUpdateWith = {
            title: 'Blog test 1 updated',
            author: 'Mateo',
            url: 'www.blogtest1.0.com',
            likes: 20,
        };

        await api.put(`/api/blogs/${falseID}`)
            .set('Authorization', await helper.generateAuthHeader())
            .send(toUpdateWith)
            .expect(400);

        const blogsAtEnd = await helper.blogsInDb();
        const titles = blogsAtEnd.map(blog => blog.title);
        expect(titles).not.toContain(toUpdateWith.title);
    });
});

afterAll(() => {
    mongoose.connection.close();
});