import personsServer from '../services/PersonsServer.js'

const PersonForm = ({newName, setNewName,
                     newNumber, setNewNumber,
                     persons, setPersons,
                     setMessage}) => {

    const handleSubmit = (event) => {
        event.preventDefault()
        if ((persons.some(person => person.name === newName) &&
            (persons.some(person => person.number === newNumber)))) {
          alert(`${newName} or ${newNumber} is already added to the phonebook`)
          setNewName('')
          setNewNumber('')
        }
        else if ((persons.some(person => person.name === newName))) {
            if (window.confirm(`${newName} is already added to the phonebook` +
                               ', replace the old number with a new one?')) {
                let updatePerson = persons.find(person => person.name === newName)
                updatePerson.number = newNumber
                personsServer.updateNumber(updatePerson)
                    .then(updatedPerson => {
                        let newPersons = [...persons]
                        let changedIndex = newPersons.findIndex(person => (
                            person.name === updatedPerson.name
                        ))
                        newPersons[changedIndex].number = updatedPerson.number
                        setPersons(newPersons)
                        setNewName('')
                        setNewNumber('')
                        setMessage('Changed ' + 
                            `${newPersons[changedIndex].name}'s number to ` + 
                            `${newPersons[changedIndex].number}`)
                        setTimeout(() => setMessage(''), 5000)
                    })
                    .catch(error => {
                        setMessage(`Error: ${updatePerson.name} has already been deleted`)
                        setTimeout(() => setMessage(''), 5000)
                    })
            }
        }
        else {
          let newPerson = {name: newName, number: newNumber}
          personsServer.addNewPerson(newPerson)
            .then(person => {
                setPersons(persons.concat(person))
                setNewName('')
                setNewNumber('')
                setMessage(`Added ${person.name}`)
                setTimeout(() => setMessage(''), 5000)
            })
        }
    }

    const handleName = (event) => setNewName(event.target.value)
    const handleNumber = (event) => setNewNumber(event.target.value)

    return (
        <form onSubmit={handleSubmit}>
            <div>
                name: <input value={newName} onChange={handleName}/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumber}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm