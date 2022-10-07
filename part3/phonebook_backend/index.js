require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
morgan.token('output', (req, res) => JSON.stringify(req.body))
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :output'
))

app.get('/api/persons/:id', (response, request, next) => {
    Person.findById(request.req.params.id)
        .then(person => {
            if (person) {
                response.res.json(person)
            }
            else {
                response.res.status(400).send('Not Found: Invalid id')
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (response, request, next) => {
    Person.findByIdAndRemove(request.req.params.id)
        .then(result => {
            response.res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (response, request, next) => {
    const body = request.req.body

    if (!body) {
        return response.res.status(400).end()
    }
    else if (!body.name) {
        return response.res.status(400).json({
            error: 'name missing'
        })
    }
    else if (!body.number) {
        return response.res.status(400).json({
            error: 'number missing'
        })
    }

    Person.find({name: body.name})
        .then(persons => {
            if (persons.length === 0) {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })

                person.save().then(savedPerson => {
                    response.res.json(savedPerson)
                })
                .catch(error => next(error))
            }
            else {
                return response.res.status(400).json({
                    error: 'name already exists'
                })
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (response, request, next) => {
    const {name, number} = request.req.body
    
    Person.findByIdAndUpdate(
        request.req.params.id,
        {name, number},
        { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (response, request, next) => {
    Person.find({}).then(phonebook => {
        response.res.json(phonebook)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Handler of requests with unknown endpoints
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message})
    }

    next(error)
}

// Handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})