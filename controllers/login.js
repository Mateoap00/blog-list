/*
    Exercise 4.18: Here I defined a login router so a user can log in with a username and a password. If the username and
    the password are correct (they are of a user registered) then a authorization token is generated using the jsonwebtoken
    package. For the username to be correct first it checks that there's a user with that username in the database, then it
    uses the password send in the request to compare to the hash key registered with that user (because the passwords never
    get saved, only the hash keys generated from each password). The route for login is a post request to /api/login/ with
    the username and password as the request body.
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body;
    try {
        const user = await User.findOne({ username });

        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

        if (user === null || !passwordCorrect) {
            return response.status(401).json({
                error: 'Invalid username or password'
            });
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        };

        /* eslint-disable no-undef */
        const token = jwt.sign(userForToken, process.env.SECRET);

        response
            .status(200)
            .send({ token, username: user.username, name: user.name });
    } catch (exception) {
        next(exception);
    }
});

module.exports = loginRouter;