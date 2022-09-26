const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')
morgan.token('output', (req, res) => JSON.stringify(req.body))
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :output'
))

let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (response, request) => {
    let content = ''

    content += '<h1>Phonebook Backend</h1>'

    persons.forEach(person => {
        content += '<div>' + person.name + ': ' + person.number + '</div>'
    })


    request.send(content)
})

app.get('/info', (response, request) => {
    let firstLine = `Phonebook has info for ${persons.length} people`
    let secondLine = `<p>${new Date()}</p>`

    request.send(firstLine + secondLine)
})

app.get('/api/persons/:id', (response, request) => {
    const id = Number(request.req.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        request.send(`<div>${person.name}: ${person.number}`)
    }
    else {
        response.res.status(400).send('Not Found: Invalid id')
    }
})

app.delete('/api/persons/:id', (response, request) => {
    const id = Number(request.req.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.res.status(204).end()
    }
    else {
        response.res.status(404).end()
    }
})

app.post('/api/persons', (response, request) => {
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
    else if (persons.find(person => person.name === body.name)) {
        return response.res.status(400).json({
            error: 'name already exists'
        })
    }
    else if (persons.find(person => person.number === body.number)) {
        return response.res.status(400).json({
            error: 'number already exists'
        })
    }

    const id = Math.floor(Math.random() * 1000)
    const person = {
        id: id,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})