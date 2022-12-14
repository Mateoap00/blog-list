/*
    Exercise 4.3: Here I added a dummy function that returns always 1 in listHelper.js and test it using a unit test, testing
    is done with the jest package.

    Exercise 4.4: For this I added a totalLikes function in listHelper, it calculates the sum of all the likes in the blogs
    array and then I test it using three unit tests for when blogs is empty, blogs array only has one blog and blogs array has
    multiple blogs.

    Exercise *4.5: Here I used the favoriteBlog function in listHelper to find the blog that has the most likes, I test this
    with three unit tests for the three same cases as before.

    Exercise *4.6: In this exercise I used the npm package lodash to use the functions groupBy, maxBy, and toArray so I can
    find the author that has the most blogs between all the blogs posts, for this first I reorder the blogs by author, so each
    author has their own number of blogs, after that I find the author that has the most blogs (length in the new object) and
    return the name of the author and the number of blogs.

    Exercise *4.7: For this exercise I used the mostLikes function defined before to get the total number of likes that a author
    has, for this I grouped the blogs by it's authors, then I calculate the sum of all of the blogs and check if that total is
    greater than the one before then that author is the new one with most likes. All tests passed for this function.
*/

const listHelper = require('../utils/list_helper');

describe('Dummy', () => {
    test('dummy returns one', () => {
        const blogs = [];

        const result = listHelper.dummy(blogs);
        expect(result).toBe(1);
    });
});

describe('Total of likes', () => {
    test('If there is no blogs, total of likes is to be 0', () => {
        const blogs = [];
        const total = listHelper.totalLikes(blogs);
        expect(total).toBe(0);
    });

    test('If only one blog total likes test is to be the number of likes of that blog', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            }
        ];
        const total = listHelper.totalLikes(blogs);
        expect(total).toBe(7);
    });

    test('Total likes test to be right', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2,
                __v: 0
            }
        ];
        const total = listHelper.totalLikes(blogs);
        expect(total).toBe(36);
    });
});

describe('Favorite blog', () => {
    test('If there is no blogs, no favorite', () => {
        const blogs = [];
        const total = listHelper.favoriteBlog(blogs);
        expect(total).toBe('No favorite');
    });

    test('If only one blog then favorite is to be that blog', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            }
        ];
        const total = listHelper.favoriteBlog(blogs);
        expect(total).toEqual(blogs[0]);
    });

    test('If there is multiple blogs then favorite is to be right', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2,
                __v: 0
            }
        ];
        const total = listHelper.favoriteBlog(blogs);
        expect(total).toEqual(blogs[2]);
    });
});

describe('Most Blogs', () => {
    test('If there is no blogs then most blogs is to be No blogs', () => {
        const blogs = [];
        const result = listHelper.mostBlogs(blogs);
        expect(result).toBe('No blogs');
    });

    test('If there is only one blog then most blogs author is that only author', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            }
        ];
        const result = listHelper.mostBlogs(blogs);
        expect(result).toEqual({
            author: 'Michael Chan',
            totalBlogs: 1
        });
    });

    test('If there is multiple blogs then most blogs is to be right ', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2,
                __v: 0
            }
        ];
        const result = listHelper.mostBlogs(blogs);
        expect(result).toEqual({
            author: 'Robert C. Martin',
            totalBlogs: 3
        });
    });

    test('If there is multiple blogs and two or more authors have the same number of blogs then most blogs is to be right', () => {
        const blogs = [
            {
                title: 'Mateo Blog 1',
                author: 'Mateo',
                likes: 7
            },
            {
                title: 'Melina Blog 1',
                author: 'Melina',
                likes: 10
            },
            {
                title: 'Leslie Blog 1',
                author: 'Leslie',
                likes: 12
            },
            {
                title: 'Leslie Blog 2',
                author: 'Leslie',
                likes: 2
            },
            {
                title: 'Mateo Blog 2',
                author: 'Mateo',
                likes: 12
            },
            {
                title: 'Melina Blog 2',
                author: 'Melina',
                likes: 7
            },
            {
                title: 'Leslie Blog 3',
                author: 'Leslie',
                likes: 10
            },
            {
                title: 'Melina Blog 3',
                author: 'Melina',
                likes: 2
            },
            {
                title: 'Mateo Blog 3',
                author: 'Mateo',
                likes: 15
            }
        ];
        const result = listHelper.mostBlogs(blogs);
        expect(result).toEqual({
            author: 'Mateo',
            totalBlogs: 3
        });
    });
});

describe('Most Likes', () => {
    test('If there is no blogs then most likes is to be No blogs', () => {
        const blogs = [];
        const result = listHelper.mostLikes(blogs);
        expect(result).toBe('No blogs');
    });

    test('If there is only one blog then most likes result is to be that author and that number of likes', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            }
        ];
        const result = listHelper.mostLikes(blogs);
        expect(result).toEqual({
            author: 'Michael Chan',
            likes: 7
        });
    });

    test('If there is multiple blogs then most likes is to be right ', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12,
                __v: 0
            },
            {
                _id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                __v: 0
            },
            {
                _id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2,
                __v: 0
            }
        ];
        const result = listHelper.mostLikes(blogs);
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        });
    });

    test('If there is multiple blogs and two or more authors have the same number of likes then most likes is to be right', () => {
        const blogs = [
            {
                title: 'Mateo Blog 1',
                author: 'Mateo',
                likes: 7
            },
            {
                title: 'Melina Blog 1',
                author: 'Melina',
                likes: 8
            },
            {
                title: 'Leslie Blog 1',
                author: 'Leslie',
                likes: 10
            },
            {
                title: 'Leslie Blog 2',
                author: 'Leslie',
                likes: 0
            },
            {
                title: 'Mateo Blog 2',
                author: 'Mateo',
                likes: 5
            },
            {
                title: 'Melina Blog 2',
                author: 'Melina',
                likes: 3
            },
            {
                title: 'Leslie Blog 3',
                author: 'Leslie',
                likes: 2
            },
            {
                title: 'Melina Blog 3',
                author: 'Melina',
                likes: 0
            },
            {
                title: 'Mateo Blog 3',
                author: 'Mateo',
                likes: 0
            }
        ];
        const result = listHelper.mostLikes(blogs);
        expect(result).toEqual({
            author: 'Mateo',
            likes: 12
        });
    });
});