const _ = require('lodash');
const dummy = (blogs) => {
    console.log(blogs);
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (totalLikes, blog) => {
        return totalLikes + blog.likes;
    };

    const total = blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0);
    return total;
};

const favoriteBlog = (blogs) => {
    const reducer = (favorite, blog) => {
        if (blog.likes > favorite.likes) {
            favorite = blog;
        }
        return favorite;
    };

    const result = blogs.length === 0
        ? 'No favorite'
        : blogs.reduce(reducer, blogs[0]);
    return result;
};

const mostBlogs = (blogs) => {
    let result;
    if (blogs.length === 0) {
        result = 'No blogs';
    } else if (blogs.length === 1) {
        const blog = blogs[0];
        result = {
            author: blog.author,
            totalBlogs: 1
        };
    } else {
        const groupByAuthors = (_.groupBy(blogs, 'author'));
        const mostBlogs = _.maxBy(_.toArray(groupByAuthors), function (authorBlogs) { return authorBlogs.length; });
        result = {
            author: mostBlogs[0].author,
            totalBlogs: mostBlogs.length
        };
    }
    return result;
};

const mostLikes = (blogs) => {
    let result;
    const reducer = (favorite, blogs) => {
        let totalOfLikes = totalLikes(blogs);
        if (totalOfLikes > favorite.likes) {
            favorite = {
                author: blogs[0].author,
                likes: totalOfLikes
            };
        }
        return favorite;
    };
    if (blogs.length === 0) {
        result = 'No blogs';
    } else if (blogs.length === 1) {
        const blog = blogs[0];
        result = {
            author: blog.author,
            likes: blog.likes
        };
    } else {
        const groupByAuthors = (_.groupBy(blogs, 'author'));
        const arrayGroupByAuthors = _.toArray(groupByAuthors);
        result = arrayGroupByAuthors.reduce(reducer, { author: '', likes: 0 });
    }
    return result;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};