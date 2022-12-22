const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

jest.setTimeout(20000);

describe('When there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'rootUser', passwordHash });

        await user.save();
    });

    test('Adding a new user succeeds with POST request (201)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mateoap00',
            name: 'Mateo Astudillo',
            password: 'astudillo',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('Adding fails if username is undefined (400)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            name: 'Fake user',
            password: 'pass'
        };

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(response.body.error).toEqual('Username must be defined');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);

    });

    test('Adding fails if username is less than 3 characters long (400)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'us',
            name: 'Fake user',
            password: 'pass'
        };

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(response.body.error).toEqual('Username must be at least 3 characters long');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });

    test('Adding fails if username has special characters (400)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'fake@#$%',
            name: 'Another fake user',
            password: 'pass'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });

    test('Adding fails if username is already taken (400)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'rootUser',
            name: 'Superuser',
            password: 'pass'
        };

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(response.body.error).toEqual('Username must be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);

    });

    test('Adding fails if password is undefined (400)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'user',
            name: 'Fake user'
        };

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(response.body.error).toEqual('Password must be defined');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);

    });

    test('Adding fails if password is less than 3 characters long (400)', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'user',
            name: 'Fake user',
            password: 'p'
        };

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(response.body.error).toEqual('Password must be at least 3 characters long');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
