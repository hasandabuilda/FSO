const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../model/blog')
const User = require('../model/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

const blogs = [
    {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user: {
            username: 'root',
            name: 'Superuser',
            id: '634d7eeee444ce91cb635783'
        },
        __v: 0
    },
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        user: {
            username: 'root',
            name: 'Superuser',
            id: '634d7eeee444ce91cb635783'
        },
        __v: 0
    },
    {
        id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        user: {
            username: 'root',
            name: 'Superuser',
            id: '634d7eeee444ce91cb635783'
        },
        __v: 0
    },
    {
        id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        user: {
            username: 'sub',
            name: 'Substitute',
            id: '634ea8f081cd7870b46d47d4'
        },
        __v: 0
    },
    {
        id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        user: {
            username: 'sub',
            name: 'Substitute',
            id: '634ea8f081cd7870b46d47d4'
        },
        __v: 0
    },
    {
        id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        user: {
            username: 'sub',
            name: 'Substitute',
            id: '634ea8f081cd7870b46d47d4'
        },
        __v: 0
    }
]

const users = [
    {
        username: 'root',
        name: 'Superuser',
        password: 'password',
        blogs: [
            {
                id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7
            },
            {
                id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5
            },
            {
                id: '5a422b3a1b54a676234d17f9',
                title: 'Canonical string reduction',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                likes: 12
            }
        ],
        id: '634d7eeee444ce91cb635783'
    },
    {
        username: 'sub',
        name: 'Substitute',
        password: '1234',
        blogs: [
            {
                id: '5a422b891b54a676234d17fa',
                title: 'First class tests',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
                likes: 10,
                user: {
                    username: 'sub',
                    name: 'Substitute',
                    id: '634ea8f081cd7870b46d47d4'
                }
            },
            {
                id: '5a422ba71b54a676234d17fb',
                title: 'TDD harms architecture',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
                likes: 0,
                user: {
                    username: 'sub',
                    name: 'Substitute',
                    id: '634ea8f081cd7870b46d47d4'
                }
            },
            {
                id: '5a422bc61b54a676234d17fc',
                title: 'Type wars',
                author: 'Robert C. Martin',
                url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
                likes: 2,
                user: {
                    username: 'sub',
                    name: 'Substitute',
                    id: '634ea8f081cd7870b46d47d4'
                }
            }
        ],
        id: '634ea8f081cd7870b46d47d4'
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = blogs
        .map(blog => new Blog({
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes,
            user: blog.user.id
        }))
    const blogPromiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(blogPromiseArray)


    await User.deleteMany({})

    const passwordHash0 = await bcrypt.hash(users[0].password, 10)
    const user0 = new User({
        username: users[0].username,
        author: users[0].name,
        passwordHash: passwordHash0
    })
    await user0.save()

    const passwordHash1 = await bcrypt.hash(users[1].password, 10)
    const user1 = new User({
        username: users[1].username,
        author: users[1].name,
        passwordHash: passwordHash1
    })
    await user1.save()
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
        expect(listHelper.favoriteBlogs(blogs)).toEqual({
            id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            user: {
                username: 'root',
                name: 'Superuser',
                id: '634d7eeee444ce91cb635783'
            },
            __v: 0
        })
    })
})

describe('most blogs', () => {
    test('gives author with most blogs', () => {
        expect(listHelper.mostBlogs(blogs)).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})

describe('most likes', () => {
    test('gives author with most total likes', () => {
        expect(listHelper.mostLikes(blogs)).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})

describe('api calls', () => {
    test('get', async () => {
        const login = await api
            .post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        // Because of how our middleware is loaded, it expects a valid
        // authentication token on any request to /api/blogs
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
        expect(response.body.length).toBe(blogs.length)
    })

    test('id', async () => {
        const login = await api
            .post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
        expect(response.body[0].id).toBeDefined()
    })

    test('post', async () => {
        const login = await api
            .post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        const blog = new Blog({
            title: 'Example',
            author: 'Hasan',
            url: 'www.example.com',
            likes: 10
        })

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
            .send(blog)

        const blogsAtEnd = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
        expect(blogsAtEnd.body.length).toBe(blogs.length + 1)
    })

    test('post without likes', async () => {
        const login = await api
            .post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        const blog = new Blog({
            title: 'Example',
            author: 'Hasan',
            url: 'www.example.com'
        })

        await api
            .post('/api/blogs')
            .send(blog)
            .set('Authorization', `bearer ${login._body.token}`)

        const blogsAtEnd = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
        const lastBlog = blogsAtEnd.body[blogsAtEnd.body.length - 1]
        expect(lastBlog.likes).toBe(0)
    })

    test('post without title or url return 400', async () => {
        const login = await api.post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        const blog = new Blog({
            author: 'Hasan'
        })

        await api.post('/api/blogs/')
            .send(blog)
            .set('Authorization', `bearer ${login._body.token}`)
            .expect(400)
    })

    test('delete', async () => {
        const login = await api
            .post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        await api
            .delete('/api/blogs/5a422a851b54a676234d17f7')
            .set('Authorization', `bearer ${login._body.token}`)
        const blogs = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
        expect(blogs.body.length).toBe(blogs.length - 1)
    })

    test('put', async () => {
        const login = await api
            .post('/api/login')
            .send({
                username: users[0].username,
                password: users[0].password
            })
        await api
            .put('/api/blogs/5a422a851b54a676234d17f7')
            .send({likes: 10})
            .set('Authorization', `bearer ${login._body.token}`)
        const blogs = await api
            .get('/api/blogs')
            .set('Authorization', `bearer ${login._body.token}`)
        expect(blogs.body[0].likes).toBe(10)
    })
})

// describe('user tests', () => {
//     test('username must be given')
//     test('password must be at least 3 characters')
//     test('username must be unique')
//     test('each blog contains the creator of the blog')
//     test('each user contains the blogs created by them')
//     test('valid token not sent')
//     test('delete can only be done by the user who added the blog')
// })