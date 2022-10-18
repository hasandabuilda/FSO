const blogsRouter = require('express').Router()
const Blog = require('../model/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const user = request.user

    let blog
    if (!('title' in request.body) || !('url' in request.body)) {
        return response.status(400).end()
    }
    else if (!('likes' in request.body)) {
        blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: 0,
            user: user._id
        })
    }
    else {
        blog = new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
            user: user._id
        })
    }
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user.id.toString()) {
        await blog.delete()
        response.status(204).end()
    }
    else {
        return response.status(400).json({
            error: 'Blog can only be deleted by the user who created it'
        })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = {
        likes: request.body.likes
    }

    const newBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true }
    )

    response.json(newBlog)
})

module.exports = blogsRouter