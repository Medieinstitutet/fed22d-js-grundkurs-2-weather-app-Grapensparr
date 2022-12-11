const currentPositionFailure = document.querySelector('.currentPositionFailure')
const searchLocation = document.querySelector('.findMyLocation')
const searchCity = document.querySelector('.searchCity')
const searchInput = document.querySelector('.searchInput')
const cityInfo = document.querySelector('.cityInfo')
const temperatureInfo = document.querySelector('.temperatureInfo')
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

//Display weather
function weatherInfo(data) {
  const {name} = data;
  cityInfo.innerHTML = name + " <i class='fa-solid fa-location-dot fa-2xs'></i>"

  JSON.stringify(localStorage.setItem("currentCity", name))

  const {temp} = data.main
  temperatureInfo.innerHTML = temp + "°C | " + Math.round(((temp * 1.8)+32)*100)/100 + "°F"
}

//Remember latest location on reload
if (window.location.reload) {
  const currentCity = localStorage.getItem("currentCity")

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&units=metric&appid=" + apikey
  ).then((response) => response.json())
  .then((data) => this.weatherInfo(data));
}