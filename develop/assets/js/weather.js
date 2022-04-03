// get current time
let searchBtn = $('.search-btn')
const currentDate = moment().format('L')

const date = []

let city = {
    lat: '',
    lon: '',
}

let searchHistory = {
    city: []
};

let cityName;

$(document).ready(function() {


    function fetchCityInfo(city_name) {
        const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=10&lang=eng&exclude=local_names&appid=${apiKey}`

        $.ajax({
            method: 'GET',
            url: apiUrl,
            dataType: 'json',
            error: function() {
                alert('Enter a city name')
            },
            success: function(res) {
                // if successful
                // console.log('list of cities', res)
                searchResult(res)
            }
        })

    } // end of fetch api

    function searchResult(res) {

        if (res.length === 0) {
            $('.weather-data').append(`<h2 style="color: red;">No result found`)
            return;
        }

        $('.results').text(`Results: ${cityName}`)
        $('.results').append('<br>')
        $.each(res, function(index) {
            let cities = `${res[index].name} , ${checkStateExist(res, index)}`
            $('.list-of-cities').append(`
            <button class="button is-rounded search-result-btn" data-number="${index}">${cities}</button>
                `)
        })

        $('.search-result-btn').on('click', function(event) {
            event.stopPropagation();
            let element = event.target.dataset.number
            $('.results').text('')
            $('.ssearch-result-btn').remove()
            displaySelectedCity(res, element)

        })

    } // end of searchResult()

    function checkStateExist(res, index) {
        if (res[index].hasOwnProperty('state')) {
            return (res[index].state)
        } else {
            return (res[index].country)
        }
    }

    function displaySelectedCity(res, id) {

        city.lat = res[id].lat;
        city.lon = res[id].lon;

        $('.results').after(`
            <p class="title current-city is-inline">${res[id].name}, ${res[id].country} (${currentDate})</p
            `)

        fetchWeatherForcast()

    }

    // get city weather data
    function fetchWeatherForcast() {

        const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&units=metric&exclude=hourly,minutely&appid=${apiKey}`

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

    function getCurrentWeather(res) {

        $('.weather-attr').after(`
        <div class="current-weather-content">
        <div class="current-weather-data mb-2">Temp: ${Math.round(res.current.temp)}°C</div>
        <div class="current-weather-data">Wind: ${res.current.wind_speed} km/h</P>
        <div class="current-weather-data mt-2 mb-2">Humidity: ${res.current.humidity} %</div>
        <div class="current-weather-data data mb-2">UV Index:<p class="${uvIndexColor(res.current.uvi)}">${Math.round(res.current.uvi)}</p></div>
        <div class="weath-attr is-size-6 mt-3">*levels of risk:
        </div>
        <div class="index is-flex"> 
        <div class="uvi-favorable is-size-6">Favorable (0-3)</div>
        <div class="uvi-moderate is-size-6">Moderate (3-5)</div>
        <div class="uvi-severe is-size-6">High (6-7)</div></div>
        </div>
  
        `)
    }

    function getCurrentWeatherIcon(res) {

        $('.current-city').after(`
            <img class="current-weather-icon" src="http://openweathermap.org/img/wn/${res.current.weather[0].icon}@2x.png" alt="${res.current.weather[0].description}">
            `)
    }

    function uvIndexColor(uvi) {

        if (uvi >= 0 && uvi <= 2) {
            return 'favorable'
        } else if (uvi >= 3 && uvi <= 5) {
            return 'moderate'
        } else {
            return 'severe'
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

        $('.five-day-forecast-header').removeClass('is-hidden')
        $('.five-day-forecast').text('5-Day Forecast:')
        $('.five-day-forecast-content').append(`
        <div class="columns is-desktop is-inline-block five-day-forecast-wrapper">
        <div class="column five-day-forecast-data">
        <p class="date">${date[index]}</p>
        <p class="weather-icon">
        <img src="http://openweathermap.org/img/wn/${data[index].weather[0].icon}@2x.png" alt="${data[index].weather[0].description}">
        </p>
        <p class="weather-attr pb-1">Temp: ${Math.round(data[index].temp.day)} °C</p>
        <p class="weather-attr pt-1 pb-1">Wind: ${data[index].wind_speed} km/h</p>
        <p class="weather-attr pt-1 pb-1">Humidity: ${data[index].humidity} % </p>
        </div>

        </div>
        `)
    }

    function removeItems() {
        if ($('.weather-container').length) {
            $('.search-result').remove()
            $('.current-city').html('')
            $('.current-city').remove()
            $('.current-weather-icon').remove()
            $('.current-weather-content').remove()
            $('.five-day-forecast-header').addClass('is-hidden')
            $('.five-day-forecast-wrapper').remove()
        }
    }

    let getCityName = function handleSubmit() {
        removeItems()
        let tempName = $(this).siblings('.city-input').val()
        cityName = tempName.charAt(0).toUpperCase() + tempName.slice(1)

        $('.city-input').val('')
        addHistory(cityName)
        fetchCityInfo(cityName)
    }

    searchBtn.on('click', getCityName)

    function onLoad() {

        if (localStorage.getItem('searchCity')) {
            searchHistory = JSON.parse(localStorage.getItem('searchCity'));

            $.each(searchHistory.city, function(index) {
                console.log(searchHistory.city[index])
                $('.dropdown-menu').append(`
                <a class="dropdown-item" href="#"><p>${searchHistory.city[index]}</p></a>
                `)
            });
        }
    }

    function addHistory(cityName) {

        if (!searchHistory.city.includes(cityName)) {
            searchHistory.city.push(cityName);
            localStorage.setItem('searchCity', JSON.stringify(searchHistory));
            $('.dropdown-menu').empty()
            onLoad()
        }
        return
    }

    $('.dropdown-menu').on('click', function(event) {
        event.stopPropagation();
        cityName = event.target.textContent

        removeItems()
        fetchCityInfo(cityName)
    });

    onLoad()
});