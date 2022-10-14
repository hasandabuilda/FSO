const blogsRouter = require('express').Router()
const Blog = require('../model/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    let blog
    if (!('title' in request.body._doc) || !('url' in request.body._doc)) {
        return response.status(400).end()
    }
    else if (!('likes' in request.body._doc)) {
        blog = new Blog({...request.body, likes: 0})
    }
    else {
        blog = new Blog(request.body)
    }
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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