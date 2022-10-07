const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })
    
function validateNumber(num) {
    const numberParts = num.split('-')

    if (numberParts.length !== 2) {
        return false
    }
    else {
        let firstPart = numberParts[0]
        let secondPart = numberParts[1]

        if ((firstPart.length !== 2) && (firstPart.length !== 3)) {
            return false
        }
        else if (!Number(firstPart) || !Number(secondPart)) {
            return false
        }
        else {
            return true
        }
    }
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: validateNumber,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)