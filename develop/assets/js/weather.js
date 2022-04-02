// get current time
let searchBtn = $('.search-btn')
const currentDate = moment().format('L')

const date = []

let city = {
    lat: '',
    lon: '',
}

let cityName = '';

$(document).ready(function() {

    function fetchCityInfo(city_name) {
        const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=10&lang=eng&exclude=local_names&appid=${config.apiKey}`

        $.ajax({
            method: 'GET',
            url: apiUrl,
            dataType: 'json',
            error: function() {
                alert('Enter a city name')
            },
            success: function(res) {
                // if successful
                // console.log(res)
                searchResult(res)
            }
        })

    } // end of fetch api

    function searchResult(res) {

        if (res.length === 0) {
            $('.weather-data').append(`<h2 style="color: red;">No result found`)
            return;
        }

        if ($('.search-result').length) {
            $('.search-result').remove()
        }

        $('.results').text('Results:')
        $.each(res, function(index) {
            let cities = `${res[index].country} , ${checkStateExist(res, index)}`
            $('.list-of-cities').after(`
                <button class="button is-rounded search-result" data-number="${index}">${cities}</button>
                `)
        })

        $('.search-result').on('click', function(event) {
            let element = event.target.dataset.number
            $('.results').text('')
            $('.search-result').remove()
            displaySelectedCity(res, element)

        })

    } // end of searchResult()

    function checkStateExist(res, index) {
        if (!res[index].hasOwnProperty('state')) {
            return (res[index].name)
        } else {
            return (res[index].state)
        }
    }

    function displaySelectedCity(res, id) {

        city.cityName = res[id].name;
        city.lat = res[id].lat;
        city.lon = res[id].lon;

        $('.current-city').after(`
            <p class="title mb-4 current-city weather-icon is-inline">${res[id].name}, ${res[id].country} (${currentDate})</p
            `)

        fetchWeatherForcast()

    }

    // get city weather data
    function fetchWeatherForcast() {

        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&units=metric&exclude=hourly,minutely,timezone&appid=${config.apiKey}`

        $.ajax({
            method: 'GET',
            url: apiUrl,
            dataType: 'json',
            error: function(error) {
                console.log(error)
            },
            success: function(res) {
                // if successful
                console.log('weather data', res)
                getCurrentWeather(res)
                getCurrentWeatherIcon(res)
                getFiveDayForecast(res)
            }
        })
        return
    } // end of fetchWeatherForccast

    function getCurrentWeather(city) {

        $('.weather-attr').after(`
        <div class="weath-attr pt-5 pb-2">Temp: ${Math.round(city.current.temp)}°C</div>
        <div class="weath-attr pt-2 pb-2">Wind: ${city.current.wind} km/h</P>
        <div class="weath-attr pt-3 pb-2">Humidity: ${city.humid} %</div>
        <div class="weath-attr pt-2 ">UV Index:<p class="uvi">${city.current.uvi}</p></div>
        <br>
        <div class="weath-attr is-size-6 ">*levels of risk: Low (0-2), Moderate (3-5), High (6-7), Very High (8-10), and Extreme (11+).</div>
        `)
    }

    function getCurrentWeatherIcon(res) {

        const weather = res.current.weather
        for (let i = 0; i < weather.length; i++) {
            $('.weather-icon').after(`
            <img src="http://openweathermap.org/img/wn/${weather[i].icon}@2x.png" alt="${weather[i].description}">
            </div>`)
        }
    }

    function getFiveDayForecast(res) {

        for (let i = 0; i < 5; i++) {
            date[i] = moment().add(i, 'days').format('DD/MM/YY')
        }

        $.each(res.daily, (index) => {
            if (index < 5) {
                displayFiveDayForcast(res.daily, index)
            }
        });
    }

    function displayFiveDayForcast(data, index) {

        $('.5-day-forecast-header').removeClass('is-hidden')
        $('.5-day-forecast').text('5-Day Forecast:')
        $('.5-day-forcast-data').append(`
        <div class="columns is-desktop is-inline-block ">
        <div class="column five-day-forcast">
        <p class="date">${date[index]}</p>
        <p class="weather-icon">
        <img src="http://openweathermap.org/img/wn/${data[index].weather[0].icon}@2x.png" alt="${data[index].weather[0].description}">
        </p>
        <p class="weather-attr pt-2 pb-2">Temp: ${Math.round(data[index].temp.day)} °C</p>
        <p class="weather-attr pt-2 pb-2">Wind: ${data[index].wind_speed} km/h</p>
        <p class="weather-attr pt-2 pb-2">Humidity: ${data[index].humidity} % </p>
        </div>

        </div>
        `)
    }

    let removeContent = function() {
        $('.show-results').remove()
        $('.search-result').remove()
    }

    let getCityName = function handleSubmit() {

        cityName = $(this).siblings('.city-input').val()
        $('.city-input').val('')
        addHistory(cityName)
        fetchCityInfo(cityName)
    }

    searchBtn.on('click', getCityName)

    function onLoad() {

        if (localStorage.getItem('searchCity')) {
            historyObj = JSON.parse(localStorage.getItem('searchCity'));
        }

        console.log(historyObj)
    }

    function addHistory(cityName) {

        historyObj.city.push(cityName);
        localStorage.setItem('searchCity', JSON.stringify(historyObj));
    }

    onLoad()
});

var historyObj = { city: [] };