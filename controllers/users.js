/*
    Exercise 4.15: In this exercise I wrote a mongodb model for users and a post request route handler so users can be
    crated and saved in the database, a user has a username, a name and a password, the password doesn't get save in the
    db but instead a hash key based on the given password is saved using the bcrypt package. Also I implemented a get route
    to show all the users saved. (Check also file models/user.js).

    Exercise 4.16*: Here I wrote some validators in the post route so it checks before saving to the database that the user
    has a defined username and password of at least 3 characters long each, it also checks that the username is unique (is not
    already registered in the db). Also I wrote a validator in the User model so it checks that the username has only letters
    and numbers. I wrote jest tests for all of this cases and for when the user is created and saved successfully.
    (Check also files models/user.js and tests/users_api.test.js).

    TO-DO: Exercises 4.17 - 4.23.
*/

const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 });
    response.status(200).json(users);
});

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body;
    try {
        if (username === undefined || username === '') {
            return response.status(400).json({
                error: 'Username must be defined'
            });
        }
        if (username.length < 3) {
            return response.status(400).json({
                error: 'Username must be at least 3 characters long'
            });
        }
        if (password === undefined || password === '') {
            return response.status(400).json({
                error: 'Password must be defined'
            });
        }
        if (password.length < 3) {
            return response.status(400).json({
                error: 'Password must be at least 3 characters long'
            });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return response.status(400).json({
                error: 'Username must be unique'
            });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = new User({ username, name, passwordHash });
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (exception) {
        next(exception);
    }
});

module.exports = usersRouter;