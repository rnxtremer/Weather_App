// app.js

const apiKey = "f656f6827baa136dff1341b912506dda"; // Replace this with your OpenWeatherMap API Key

// DOM Elements
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const weatherContainer = document.getElementById("weatherContainer");
const forecastContainer = document.getElementById("forecastContainer");
const loader = document.getElementById("loader");
const locationTitle = document.getElementById("locationTitle");
const body = document.body;

// On load, get weather by geolocation
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        fetchWeatherByCity("Delhi");
      }
    );
  } else {
    fetchWeatherByCity("Delhi");
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

function fetchWeatherByCity(city) {
  loader.style.display = "block";
  weatherContainer.style.display = "none";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        fetchWeatherByCoords(data.coord.lat, data.coord.lon, city);
      } else {
        alert("City not found!");
        loader.style.display = "none";
      }
    })
    .catch(() => alert("Something went wrong!"));
}

function fetchWeatherByCoords(lat, lon, cityName = null) {
  loader.style.display = "block";
  weatherContainer.style.display = "none";

  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  Promise.all([fetch(currentWeatherURL), fetch(forecastURL)])
    .then(async ([currentRes, forecastRes]) => {
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();
      updateUI(currentData, forecastData, cityName);
    })
    .catch(() => alert("Error fetching weather data"));
}

function updateUI(current, forecast, cityName = null) {
  loader.style.display = "none";
  weatherContainer.style.display = "block";

  const name = cityName || current.name;
  locationTitle.innerHTML = `Weather of <strong>${name}</strong>`;

  const weatherIcon = current.weather[0].icon;
  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const humidity = current.main.humidity;
  const pressure = current.main.pressure;
  const windSpeed = current.wind.speed;
  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString();

  document.getElementById("currentWeather").innerHTML = `
    <div class="col-md-4">
      <div class="card text-center">
        <div class="card-header">Condition</div>
        <div class="card-body">
          <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="icon" />
          <h4>${temp}&deg;C</h4>
          <p>Feels like: ${feelsLike}&deg;C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Pressure: ${pressure} hPa</p>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card text-center">
        <div class="card-header">Sun Times</div>
        <div class="card-body">
          <p>Sunrise: ${sunrise}</p>
          <p>Sunset: ${sunset}</p>
          <p>Wind Speed: ${windSpeed} km/h</p>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card text-center">
        <div class="card-header">Location Info</div>
        <div class="card-body">
          <p>Latitude: ${current.coord.lat}</p>
          <p>Longitude: ${current.coord.lon}</p>
          <p>Country: ${current.sys.country}</p>
        </div>
      </div>
    </div>
  `;

  // Update Background
  setBackground(current.weather[0].main.toLowerCase());

  // 10 Day Forecast (actually 5 days x 8 = 40 entries, 1 every 3hr)
  forecastContainer.innerHTML = "";
  const dailyData = {};
  forecast.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = entry;
    }
  });

  Object.keys(dailyData)
    .slice(0, 10)
    .forEach((date) => {
      const dayData = dailyData[date];
      const icon = dayData.weather[0].icon;
      const temp = Math.round(dayData.main.temp);
      const condition = dayData.weather[0].main;

      forecastContainer.innerHTML += `
      <div class="col-md-2">
        <div class="card text-center">
          <div class="card-body">
            <p>${date}</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="icon" />
            <h5>${temp}&deg;C</h5>
            <p>${condition}</p>
          </div>
        </div>
      </div>
    `;
    });
}

function setBackground(condition) {
  let image = "";
  switch (condition) {
    case "clear":
      image = "url('images/clear.jpg')";
      break;
    case "clouds":
      image = "url('images/clouds.jpg')";
      break;
    case "rain":
      image = "url('images/rain.jpg')";
      break;
    case "snow":
      image = "url('images/snow.jpg')";
      break;
    case "mist":
    case "haze":
      image = "url('images/mist.jpg')";
      break;
    default:
      image = "url('images/default.jpg')";
  }
  document.body.style.backgroundImage = image;
}
