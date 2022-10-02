import axios from 'axios'
const baseUrl = '/api/persons'

const addNewPerson = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const removePerson = id => {
    const deleteUrl = baseUrl + `/${id}`
    return axios.delete(deleteUrl)
}

const updateNumber = person => {
    let personContents = {name: person.name, number: person.number}
    const request = axios.put(baseUrl + `/${person.id}`, personContents)
    return request.then(response => response.data)
}

const getPersons = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

export default {
    addNewPerson,
    removePerson,
    updateNumber,
    getPersons
}