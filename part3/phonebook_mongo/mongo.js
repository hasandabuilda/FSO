const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Error: More arguments needed')
    console.log('   Show all entries: node mongo.js <password>')
    console.log('   Add new entry: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
let inputName = '', inputNumber = ''
if (process.argv.length > 3) {
    inputName = process.argv[3]
    inputNumber = process.argv[4]
}

const url = `mongodb+srv://hasandabuilda:${password}@cluster0.lxiwnex.mongodb.net/Phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then((result) => {
        console.log('Connected')

        if (process.argv.length === 3) {
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
        }
        else {
            const person = new Person({
                name: inputName,
                number: inputNumber,
            })
            person
                .save()
                .then(() => {
                    console.log('New Person saved')
                    mongoose.connection.close()
                })
        }
    })