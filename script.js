"use strict"
const buttonOpenSearch = document.querySelector('.location__btn');
const buttonCloseSearch = document.querySelector('input[type="button"]');
const search = document.querySelector('.location__search');
const inputSearch = document.querySelector('input[type="text"]');
const informeWeather = document.querySelector('.informe');
const DATE = new Date();
let months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December'
];
let apiKey = 'a9736d02d1b4d93c07cd06532897974c';

async function handleError(error) {
   // эту фукнцию можно передать колбэком на случай ошибок

   const { code } = error

   switch (code) {
      case GeolocationPositionError.TIMEOUT:
         // время получения геолокации истекло
         break
      case GeolocationPositionError.PERMISSION_DENIED:
         // пользователь запретил трекинг своей геопозиции
         let weatherInfo = await getWeather(55.76, 37.62);

         let weatherData = {
            name: weatherInfo.name,
            date: weatherInfo.dt,
            temp: weatherInfo.main.temp,
            description: weatherInfo['weather'][0]['main'],
            wind: weatherInfo.wind.speed,
            humidity: weatherInfo.main.humidity
         }

         outputWeatherData(weatherData);
         break
      case GeolocationPositionError.POSITION_UNAVAILABLE:
         // получить местоположение не удалось
         break
   }
}


function closeSearch() {
   search.classList.remove('_open-search');
}

function openSearch() {
   search.classList.add('_open-search');
}

buttonOpenSearch.addEventListener('click', openSearch);
buttonCloseSearch.addEventListener('click', closeSearch);
inputSearch.addEventListener('change', closeSearch);

search.onsubmit = submitHandler;

async function submitHandler(event) {
   event.preventDefault();
   let cityInfo = await getGeo(inputSearch.value);
   let weatherInfo = await getWeather(cityInfo[0]["lat"], cityInfo[0]["lon"]);

   let weatherData = {
      name: weatherInfo.name,
      date: weatherInfo.dt,
      temp: weatherInfo.main.temp,
      description: weatherInfo['weather'][0]['main'],
      wind: weatherInfo.wind.speed,
      humidity: weatherInfo.main.humidity
   }

   outputWeatherData(weatherData);
}

async function getGeo(name) {
   let geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`;
   let response = await fetch(geoUrl);
   let data = await response.json();
   return data;
}

async function getWeather(lat, lon) {
   let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
   let response = await fetch(weatherUrl);
   let data = await response.json();
   return data;
}

function outputWeatherData(weatherData) {
   let cityName = document.querySelector('.location__locality');
   let date = informeWeather.querySelector('time');
   let temp = informeWeather.querySelector('.informe__temperature');
   let description = informeWeather.querySelector('.informe__description');
   let wind = informeWeather.querySelector('#wind');
   let humidity = informeWeather.querySelector('#hum');

   cityName.textContent = weatherData.name;
   temp.textContent = `${Math.round(weatherData.temp)}°`;
   description.textContent = weatherData.description;
   wind.textContent = `${Math.round(weatherData.wind)} km/h`;
   humidity = `${Math.round(weatherData.humidity)} %`;
   date.textContent = `Today, ${DATE.getDate()} ${months[DATE.getMonth()]}`;
}