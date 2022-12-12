const currentPositionFailure = document.querySelector('.currentPositionFailure')
const searchLocation = document.querySelector('.findMyLocation')
const searchCity = document.querySelector('.searchCity')
const searchInput = document.querySelector('.searchInput')
const cityInfo = document.querySelector('.cityInfo')
const temperatureInfo = document.querySelector('.temperatureInfo')
const feelsLikeInfo = document.querySelector('.feelsLike')
const minMaxTemp = document.querySelector('.minMaxTemp')
const humidityInfo = document.querySelector('.humidity')
const windSpeedInfo = document.querySelector('.windSpeed')
const sunriseInfo = document.querySelector('.sunrise')
const sunsetInfo = document.querySelector('.sunset')
const apikey = "84a9e3473035153f383f2976491a4b4b"

//Weather by location
function getMyLocation() {
  navigator.geolocation.getCurrentPosition(success, error);
  
  function success(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=" + apikey
    ).then((response) => response.json())
    .then((data) => this.weatherInfo(data));

    currentPositionFailure.style.display = "none"
  }

  function error() {
    currentPositionFailure.innerHTML = "Your location could not be found." + "<br>" + "Please try again and allow us to find your" + "<br>" + "location, or use the search-bar below!"
  }
}

searchLocation.addEventListener('click', getMyLocation)

//Weather by search
function searchWeatherbyCity() {
  const city = searchInput.value

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apikey
  ).then((response) => response.json())
  .then((data) => weatherInfo(data));
}

searchCity.addEventListener('click', searchWeatherbyCity)

//Display weather
function weatherInfo(data) {
  const {name} = data;
  cityInfo.innerHTML = name + " <i class='fa-solid fa-location-dot fa-2xs'></i>"

  JSON.stringify(localStorage.setItem("currentCity", name))

  const {temp} = data.main
  temperatureInfo.innerHTML = temp + "°C | " + Math.round(((temp * 1.8)+32)*100)/100 + "°F"
  
  const {feels_like} = data.main
  feelsLikeInfo.innerHTML = "Feels like " + feels_like + "°C"

  const {temp_min} = data.main
  const {temp_max} = data.main
  minMaxTemp.innerHTML = "Min & max temp: " + temp_min + "°C | " + temp_max + "°C"

  const {humidity} = data.main
  humidityInfo.innerHTML = "Humidity: "+ humidity + "%"

  const {speed} = data.wind
  windSpeedInfo.innerHTML = "Wind speed: " + Math.round((speed / 3.6)*100)/100 + " m/s"

  const {sunrise} = data.sys
  const {sunset} = data.sys
  const {timezone} = data

  let unix_timestamp_sunrise = (sunrise + timezone - 3600)
  var date = new Date(unix_timestamp_sunrise * 1000)
  var hours = date.getHours()
  var minutes = "0" + date.getMinutes()
  var formattedTimeSunrise = "0" + hours + ':' + minutes.substr(-2)

  sunriseInfo.innerHTML = "Sunrise: " + formattedTimeSunrise

  let unix_timestamp_sunset = (sunset + timezone - 3600)
  var date = new Date(unix_timestamp_sunset * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTimeSunset = hours + ':' + minutes.substr(-2)

  sunsetInfo.innerHTML = "Sunset: " + formattedTimeSunset
}

//Remember latest location on reload
if (window.location.reload) {
  if (localStorage.length > 0){
  const currentCity = localStorage.getItem("currentCity")

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=metric&appid=" + apikey
  ).then((response) => response.json())
  .then((data) => this.weatherInfo(data));
  }
  else {
    const currentCity = 'Stockholm'

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=metric&appid=" + apikey
    ).then((response) => response.json())
    .then((data) => this.weatherInfo(data));
  }
}