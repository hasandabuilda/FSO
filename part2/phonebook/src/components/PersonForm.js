const PersonForm = ({newName, setNewName,
                     newNumber, setNewNumber,
                     persons, setPersons}) => {

    const handleSubmit = (event) => {
        event.preventDefault()
        if ((persons.some(person => person.name === newName) ||
            (persons.some(person => person.number === newNumber)))) {
          alert(`${newName} or ${newNumber} is already added to the phonebook`)
          setNewName('')
          setNewNumber('')
        }
        else {
          setPersons(persons.concat({name: newName, number: newNumber}))
          setNewName('')
          setNewNumber('')
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