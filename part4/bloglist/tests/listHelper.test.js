const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../model/blog')

const api = supertest(app)

const masterBlogs = [
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
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = masterBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        let blogs = [
            {
                likes: 2
            }
        ]
        expect(listHelper.totalLikes(blogs)).toBe(blogs[0].likes)
    })

    test('of a bigger list is calculated right', () => {
        let blogs = [
            {
                likes: 2
            },
            {
                likes: 2
            },
            {
                likes: 2
            }
        ]
        expect(listHelper.totalLikes(blogs)).toBe(6)
    })
})

describe('favorite blogs', () => {
    test('gives empty object for no blogs', () => {
        expect(listHelper.favoriteBlogs([])).toEqual({})
    })

    test('gives most liked blog', () => {
        expect(listHelper.favoriteBlogs(masterBlogs)).toEqual({
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        })
    })
})

describe('most blogs', () => {
    test('gives author with most blogs', () => {
        expect(listHelper.mostBlogs(masterBlogs)).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})

describe('most likes', () => {
    test('gives author with most total likes', () => {
        expect(listHelper.mostLikes(masterBlogs)).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})

describe('api calls', () => {
    test('get', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(masterBlogs.length)
    })

    test('id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('post', async () => {
        const blog = new Blog({
            title: 'Example',
            author: 'Hasan',
            url: 'www.example.com',
            likes: 10
        })

        await api.post('/api/blogs').send(blog)

        const blogsAtEnd = await api.get('/api/blogs')
        expect(blogsAtEnd.body.length).toBe(masterBlogs.length + 1)
    })

    test('post without likes', async () => {
        const blog = new Blog({
            title: 'Example',
            author: 'Hasan',
            url: 'www.example.com'
        })

        await api.post('/api/blogs').send(blog)

        const blogsAtEnd = await api.get('/api/blogs')
        const lastBlog = blogsAtEnd.body[blogsAtEnd.body.length - 1]
        expect(lastBlog.likes).toBe(0)
    })

    test('post without title or url return 400', async () => {
        const blog = new Blog({
            author: 'Hasan'
        })

        await api.post('/api/blogs/').send(blog).expect(400)
    })

    test('delete', async () => {
        await api.delete('/api/blogs/5a422a851b54a676234d17f7')
        const blogs = await api.get('/api/blogs')
        expect(blogs.body.length).toBe(masterBlogs.length - 1)
    })

    test('put', async () => {
        await api
            .put('/api/blogs/5a422a851b54a676234d17f7')
            .send({likes: 10})
        const blogs = await api.get('/api/blogs')
        expect(blogs.body[0].likes).toBe(10)
    })
})