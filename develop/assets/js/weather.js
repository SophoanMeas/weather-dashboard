// get current time
let searchBtn = $('.search-btn')
let cityNameInput = $('#city-name')

const currentDate = moment().format('L')

$(document).ready(function() {

    function getForecast(city_name) {

        const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=10&units=imperial&lang=eng&appid=${config.apiKey}`

        $.ajax({
                method: 'GET',
                url: apiUrl,
                dataType: 'json',
                success: function(res) {
                    // if successful
                    console.log(res)
                    searchResult(res)
                }
            })
            // if fail to connect
            .fail(function() {
                alert('Unable to connect to openweathermap.org')
            })
    } // end of fetch api

    function searchResult(res) {
        if (res.length === 0) {
            $('.weather-data').append(`<h2 style="color: red;">No result found`)
            return;
        }

        $('.results').append(`<h2>Results:`)
        $.each(res, function(index) {
            let cities = `${res[index].country} , ${checkStateExist(res, index)}`
            console.log(cities)
            $('.city-name').after(`
                <button class="button is-rounded list-cities">${cities}</button>
                `)
        })
    } // end of searchResult()

    function checkStateExist(res, index) {
        if (!res[index].hasOwnProperty('state')) {
            return (res[index].name)
        } else {
            return (res[index].state)
        }
    }

    let getCityName = function handleSubmit() {
        cosole.log(cityNameInput.text())
    }



});