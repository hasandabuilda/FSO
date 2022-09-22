import {useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter newFilter={newFilter} setNewFilter={setNewFilter} />
      <h2>add a new</h2>
      <PersonForm newName={newName} setNewName={setNewName}
                  newNumber={newNumber} setNewNumber={setNewNumber}
                  persons={persons} setPersons={setPersons}
                  setMessage={setMessage}
                  />
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} newFilter={newFilter}/>
    </div>
  )
}

export default App