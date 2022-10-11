const totalLikes = (blogPosts) => {

    if (blogPosts.length === 0) {
        return 0
    }

    let sum = blogPosts.reduce((sum, blog) => sum += blog.likes, 0)
    return sum
}

const favoriteBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    else {
        return blogs.reduce((mostLikedBlog, blog) => (
            (blog.likes > mostLikedBlog.likes) ? blog : mostLikedBlog
        ))
    }
}

const mostBlogs = (blogs) => {
    let blogsPerAuthor = {}
    blogs.forEach(blog => {
        if (blog.author in blogsPerAuthor) {
            blogsPerAuthor[blog.author]++
        }
        else {
            blogsPerAuthor[blog.author] = 1
        }
    })

    let blogsPerAuthorArray = Object.entries(blogsPerAuthor)
    let maxAuthor = blogsPerAuthorArray.reduce((maxAuthor, author) => (
        (author[1] > maxAuthor[1]) ? author : maxAuthor)
    )
    return {
        author: maxAuthor[0],
        blogs: maxAuthor[1]
    }
}

const mostLikes = (blogs) => {
    let likesPerAuthor = {}
    blogs.forEach(blog => {
        if (blog.author in likesPerAuthor) {
            likesPerAuthor[blog.author] += blog.likes
        }
        else {
            likesPerAuthor[blog.author] = blog.likes
        }
    })

    let likesPerAuthorArray = Object.entries(likesPerAuthor)
    let maxAuthor = likesPerAuthorArray.reduce((maxAuthor, author) => (
        (author[1] > maxAuthor[1]) ? author : maxAuthor
    ))
    return ({
        author: maxAuthor[0],
        likes: maxAuthor[1]
    })
}

module.exports = {
    totalLikes,
    favoriteBlogs,
    mostBlogs,
    mostLikes
}