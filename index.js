/*
    BLOG LIST APP

    Step 1: Initialize the project installing the necessary npm packages and creating the mongodb schema for the blogs.
    Connecting the express app to the database, and defining get and post routes handlers, then testing the routes with
    vs code rest client.
*/

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// Blogs Model
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
});

const Blog = new mongoose.model('Blog', blogSchema);

// MongoDB connection
const uri = 'mongodb+srv://mateoap00:miNina@cluster0.kqfgyqp.mongodb.net/blog-list?retryWrites=true&w=majority';

console.log('Connecting to MongoDB...');
mongoose.connect(uri)
    .then(() => {
        console.log('Connected successfully to MongoDB!');
    })
    .catch(error => {
        console.log('Failed to connect to MongoDB!');
        console.log(error.message);
    });

// Routes

app.get('/', (request, response) => {
    response.send('<h1>Blog List App </h1>');
});

app.get('/api/blogs', (request, response) => {
    Blog.find({})
        .then(blogs => {
            console.log('Blogs: ', blogs);
            response.status(200).json(blogs);
        }).catch(error => {
            console.log('Error: ', error.message);
            response.status(400).send();
        });
});

app.post('/api/blogs', (request, response) => {
    const body = request.body;
    const newBlog = new Blog(body);

    newBlog.save()
        .then(() => {
            console.log('Blog saved!');
            response.status(200).json(newBlog);
        }).catch(error => {
            console.log('Failed to save test');
            console.log(error.message);
            response.status(400).send();
        });
});

// Start express app
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});