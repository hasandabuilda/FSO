const Persons = ({persons, newFilter}) => {
    return (persons.map(person => {
        if (person.name.includes(newFilter)) {
            return <div key={person.name}>{person.name} {person.number}</div>
        }
    }))
}

export default Persons