import {useEffect} from 'react'
import axios from 'axios'

let temp, wind, weatherPicURL
const Weather = ({country, setWeatherObtained}) => {
    const api_key = process.env.REACT_APP_WEATHER_API_KEY
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]

    let weather
    useEffect(() => {
        axios
        .get(`http://api.openweathermap.org/data/2.5/` +
             `forecast?lat=${lat}&lon=${lon}&appid=${api_key}` +
             '&units=imperial')
        .then(response => {
            weather = response.data
            console.log(weather)
            temp = weather.list['0'].main.feels_like
            wind = weather.list[0].wind.speed
            weatherPicURL = 'http://openweathermap.org/img/wn/' +
                            weather.list[0].weather[0].icon +
                            '@2x' + // Size multiplier
                            '.png'
            setWeatherObtained(true)
        })
    }, [])
    
    if (weather) {
        return <div></div>
    }
    else {
        return  (
            <>
                <h2>Weather in {country.capital}</h2>
                <div>temperature {temp} Celsius</div>
                <img src={weatherPicURL} />
                <div>wind {wind} m/s</div>
            </>
        )
    }
}

const Countries = ({searchWord, chosenCountry, setChosenCountry,
                    countries, setWeatherObtained}) =>
{

    const showCountry = (event) => {
        // Parent element of button has selected country name but
        // inner text appends the "Show" from the button
        let name = event.target.parentElement.innerText.replace('show','')
        setChosenCountry(name)
    }

    const returnDetailedCountry = (country) => {
        let languages = Object.values(country.languages)

        return (
            <>
                <h1>{country.name.common}</h1>
                <div>capital {country.capital}</div>
                <div>area {country.area}</div>
                <h2>languages:</h2>
                <ul>
                    {languages.map(lang => <li key={lang}>{lang}</li>)}
                </ul>
                <img src={country.flags.png} />
                <Weather country={country}
                         setWeatherObtained={setWeatherObtained} />
            </>
        )
    }

    const showCountries = () => {
            
        const searchCountries = countries.filter(
            country => country.name.common.toLowerCase().includes(searchWord))

        if (chosenCountry) {
            let country = searchCountries.filter(
                country => country.name.common === chosenCountry)[0]
            return(returnDetailedCountry(country))
        }
        if (searchCountries.length > 10) {
            return(<div>Too many matches, specify another filter</div>)
        }
        else if (searchCountries.length == 1) {
            return(returnDetailedCountry(searchCountries[0]))
        }
        else {
            return (searchCountries.map(country => (
                <div key={country.cca2}>
                    {country.name.common}
                    <button onClick={showCountry}>show</button>
                </div>
            )))
        }
    }

    return (
        <>
            {showCountries()}
        </>
    )
}

export default Countries