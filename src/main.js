const currentPositionFailure = document.querySelector('.currentPositionFailure');
const searchLocation = document.querySelector('.findMyLocation');
const searchCity = document.querySelector('.searchCity');
const searchInput = document.querySelector('.searchInput');
const cityInfo = document.querySelector('.cityInfo');
const temperatureInfo = document.querySelector('.temperatureInfo');
const feelsLikeInfo = document.querySelector('.feelsLike');
const descriptionInfo = document.querySelector('.descriptionInfo');
const humidityInfo = document.querySelector('.humidity');
const windSpeedInfo = document.querySelector('.windSpeed');
const sunriseInfo = document.querySelector('.sunrise');
const sunsetInfo = document.querySelector('.sunset');
const forcast24h = document.querySelector('.forcast24h');
const currentWeatherButton = document.querySelector('.currentWeatherButton');
const forcast = document.querySelector('.forcast');
const backgroundImage = document.querySelector('body');
const forcastWeather = document.querySelector('.forcastWeather');
const currentWeather = document.querySelector('.currentWeather');
const apikey = '84a9e3473035153f383f2976491a4b4b';
const addressPart1 = 'https://api.openweathermap.org/data/2.5/weather?q=';
const addressPart2 = '&units=metric&appid=';
const forcastAddress = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const lat = 'https://api.openweathermap.org/data/2.5/weather?lat=';
const long = '&lon=';
const twentyfourHours = document.querySelector('.forcast24')
const fourtyeightHours = document.querySelector('.forcast48')
const seventytwoHours = document.querySelector('.forcast72')
const date = new Date();
const day = date.getDay();

/* require("dotenv").config();

console.log(process.env.apikey); */

// TO DO
// Add button to select C / F
// Add 5 day forcast

currentWeather.style.display = 'block';
forcastWeather.style.display = 'none';
currentWeatherButton.style.display = 'none';

// Weather by location
searchLocation.addEventListener('click', function askForPermission () {
  navigator.geolocation.getCurrentPosition(success, error);
})

function success (position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(lat + latitude + long + longitude + addressPart2 + apikey)
    .then((response) => response.json())
    .then((data) => this.weatherInfo(data));

  currentPositionFailure.style.display = 'none';
}

function error () {
  currentPositionFailure.innerHTML = 'Your location could not be found.' + '<br>' + 'Please try again and allow us to find your' + '<br>' + 'location, or use the search-bar below!';
}

// Weather by search
function searchWeatherbyCity () {
  const city = searchInput.value;

  searchInput.value = '';

  fetch(addressPart1 + city + addressPart2 + apikey)
    .then((response) => response.json())
    .then((data) => weatherInfo(data));

  fetch(forcastAddress + city + addressPart2 + apikey)
    .then((response) => response.json())
    .then((data2) => weatherInfoForcast(data2));
}

searchInput.addEventListener('keypress', function keypress (event) {
  if (event.key === 'Enter') {
    searchCity.click();
  }
})

searchCity.addEventListener('click', searchWeatherbyCity);

// Display weather
function weatherInfo (data) {
  const { name } = data;
  cityInfo.innerHTML = name + ' <i class="fa-solid fa-location-dot fa-2xs"></i>';

  localStorage.setItem('currentCity', name);

  const { temp } = data.main;
  temperatureInfo.innerHTML = temp + '°C';

  const { feels_like } = data.main;
  feelsLikeInfo.innerHTML = 'Feels like ' + feels_like + '°C';

  const { description } = data.weather[0];

  const { icon } = data.weather[0];
  descriptionInfo.innerHTML = '<img src = ./img/icons/' + icon + '.png alt="Icon depicting current weather.">' + description.charAt(0).toUpperCase() + description.slice(1);

  const { humidity } = data.main;
  humidityInfo.innerHTML = '<i class="fa-solid fa-droplet"></i>' + '<br>' + humidity + '%';

  const { speed } = data.wind;
  windSpeedInfo.innerHTML = '<i class="fa-solid fa-wind"></i>' + '<br>' + speed + ' km/h';

  const { sunrise } = data.sys;
  const { sunset } = data.sys;
  const { timezone } = data;

  const unix_timestamp_sunrise = (sunrise + timezone - 3600);
  const dateSunrise = new Date(unix_timestamp_sunrise * 1000);
  const hoursSunrise = dateSunrise.getHours();
  const minutesSunrise = '0' + dateSunrise.getMinutes();
  const formattedTimeSunrise = '0' + hoursSunrise + ':' + minutesSunrise.substr(-2);

  sunriseInfo.innerHTML = '<i class="fa-solid fa-sun"></i>' + '<i class="fa-solid fa-sort-up"></i>' + '<br>' + formattedTimeSunrise;

  const unix_timestamp_sunset = (sunset + timezone - 3600);
  const dateSunset = new Date(unix_timestamp_sunset * 1000);
  const hoursSunset = dateSunset.getHours();
  const minutesSunset = '0' + dateSunset.getMinutes();
  const formattedTimeSunset = hoursSunset + ':' + minutesSunset.substr(-2);

  sunsetInfo.innerHTML = '<i class="fa-solid fa-sun"></i>' + '<i class="fa-solid fa-sort-down"></i>' + '<br>' + formattedTimeSunset;

  if (temp < -20) {
    backgroundImage.style.backgroundImage = 'url("./img/twentyMinus.jpg")';
  } else if (temp < -10) {
    backgroundImage.style.backgroundImage = 'url("./img/tenMinus.jpg")';
  } else if (temp < 0) {
    backgroundImage.style.backgroundImage = 'url("./img/minusDegrees.jpg")';
  } else if (temp < 10) {
    backgroundImage.style.backgroundImage = 'url("./img/plusDegrees.jpg")';
  } else if (temp < 20) {
    backgroundImage.style.backgroundImage = 'url("./img/tenPlus.jpg")';
  } else if (temp < 30) {
    backgroundImage.style.backgroundImage = 'url("./img/twentyPlus.jpg")';
  } else if (temp > 30) {
    backgroundImage.style.backgroundImage = 'url("./img/thirtyPlus.jpg")';
  }
}

function weatherInfoForcast (data2) {
  forcast.innerHTML = '';
  for (i = 0; i < 9; i++) {
    const { temp } = data2.list[i].main;
    const { description } = data2.list[i].weather[0];
    const { humidity } = data2.list[i].main;
    const { speed } = data2.list[i].wind;

    const {dt_txt} = data2.list[i];
    const day = dt_txt.substring(0, 10);
    const time = dt_txt.substring(11, 16);

    const forcastTime = day + ' at ' + time + ': ';
    forcast.innerHTML += forcastTime + '<br>' +
      '<i class="fa-solid fa-temperature-half"></i> ' + temp + '°C' + ' (' + description + ')' + '<br>' +
      '<i class="fa-solid fa-droplet"></i> ' + humidity + '%' + '<br>' +
      '<i class="fa-solid fa-wind"></i> ' + speed + ' km/h' + '<br><br>';
  }
}

forcast24h.addEventListener('click', function displayForcast () {
  currentWeather.style.display = 'none';
  forcastWeather.style.display = 'block';
  forcast24h.style.display = 'none';
  currentWeatherButton.style.display = 'block';
})

currentWeatherButton.addEventListener('click', function displayCurrentWeather () {
  currentWeather.style.display = 'block';
  forcastWeather.style.display = 'none';
  forcast24h.style.display = 'block';
  currentWeatherButton.style.display = 'none';
})

// Remember latest location on reload
if (window.location.reload) {
  if (localStorage.length > 0) {
    const currentCity = localStorage.getItem('currentCity');

    fetch(addressPart1 + currentCity + addressPart2 + apikey)
      .then((response) => response.json())
      .then((data) => this.weatherInfo(data));

    fetch(forcastAddress + currentCity + addressPart2 + apikey)
      .then((response) => response.json())
      .then((data2) => weatherInfoForcast(data2));
  } else {
    const currentCity = 'Stockholm';

    fetch(addressPart1 + currentCity + addressPart2 + apikey)
      .then((response) => response.json())
      .then((data) => this.weatherInfo(data));

    fetch(forcastAddress + currentCity + addressPart2 + apikey)
      .then((response) => response.json())
      .then((data2) => weatherInfoForcast(data2));
  }
}
