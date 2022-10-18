const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../model/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1})

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    if (!('username' in request.body)) {
        return response.status(400).json({
            error: 'username is required'
        })
    }
    else if (!('password' in request.body)) {
        return response.status(400).json({
            error: 'password is required'
        })
    }
    else if (request.body.password.length < 3) {
        return response.status(400).error({
            error: 'password must be at least 3 characters long'
        })
    }
    const { username, name, password } = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter