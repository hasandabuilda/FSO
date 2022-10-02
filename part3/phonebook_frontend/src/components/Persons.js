import personServer from '../services/PersonsServer.js'

const Persons = ({persons, setPersons, newFilter}) => {

    const removePerson = (id) => {
        if (window.confirm("Do you really want to delete?")) {
            personServer
                .removePerson(id)
                .then(
                    setPersons(persons.filter(person => person.id !== id))
                )
        }
    }

    return (persons.map(person => {
        if (person.name.includes(newFilter)) {
            return (
                <>
                    <span key={person.name}>{person.name} {person.number}</span>
                    <button key={person.id} onClick={() => removePerson(person.id)}>delete</button>
                    <br></br>
                </>
            )
        }
    }))
}

export default Persons