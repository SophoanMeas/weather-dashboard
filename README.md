<h1 align="center">Server Side Apis
  
# Weather Dashboard ☁️❄️⛅🌩️☀️🌨️🌧️
  
🔅 Weather Dashboard is a weather application that allows the user to search a city and retrieve the current weather information and the next 5-day forcast.
🔅 It display the city; 
  <ul>
    <li>Temperature 🌡️°C</li>
    <li>Wind speed 🎐km/h</li>
    <li>Humidity ⛱️</li>
    <li>UV-index rating ☀️</li>
  </ul>

 ## ✴️How It Work✴️

* The app makes a api call to openweather.org to retrieve the data from the server when the user enter a city name. It return a list of cities that matches the user input and display it in the html.
* The user select the city that the user want to see. The app get the city latitude and longitude then makes another api call to openweather.org with a different url 
* The app fetch the response from the server and render the proper information for the user in the html.
* The search history is save locally everytime a search is made and update the search history dropmenu list
* The app can be close and the search history will be display upon next run time

## ✳️How to use✳️ 
  <ol>
    <li>Click on the link to open the application</li>
    <li>Or you can clone the repository</li>
    <li>Use visual code or any text editor to view the source code. </li>
    <li>Launch the index.html file in your browser to open the application</li>

## Application
<a href="https://sophoanmeas.github.io/weather-dashboard/develop/index.html" target="_blank"><h2>➡️Weather Dashboard</a>

## Functions/Features

* 🌞 The user can search by city name to get a list of cities
* 🌞 The user can select from the list to retrieve that city weather report
* 🌞 The app display the city current weather report
* 🌞 The app display 5 day forecast 
* 🌞 The app save the search history locally and load the data when the user click the search button or run the app again
* 🌞 The app display the city temperature, wind speed, humidity and UV index rating
* 🌞 The UV index is color coded to indicate current UV level
  
  * ![#19c51e](https://via.placeholder.com/15/19c51e/000000?text=+) `Favorable` 
  * ![#eeba0f](https://via.placeholder.com/15/eeba0f/000000?text=+) `Moderate`
  * ![#e60505db](https://via.placeholder.com/15/e60505db/000000?text=+) `Severe` 
  
## Screenshot
![Alt text](https://sophoanmeas.github.io/weather-dashboard/develop/assets/img/screen-shot.gif)
