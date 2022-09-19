import {useState, useEffects, useEffect} from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [searchWord, setSearchWord] = useState('')
  const [countries, setCountries] = useState([])
  const [chosenCountry, setChosenCountry] = useState('')
  const [weatherObtained, setWeatherObtained] = useState(false)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const findCountries = (event) => {
    console.log('searching')
    setSearchWord(event.target.value)
    setChosenCountry('')
    setWeatherObtained(false)
  }

  return (
    <div>
      <form>
        find countries: <input value={searchWord} onChange={findCountries}/>
      </form>
      <Countries searchWord={searchWord}
                 chosenCountry={chosenCountry}
                 setChosenCountry={setChosenCountry}
                 countries={countries} 
                 setWeatherObtained={setWeatherObtained}
                 />
    </div>
  )
}

export default App;