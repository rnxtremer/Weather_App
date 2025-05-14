const city = document.querySelector(".city");
const about_city = document.querySelector(".a_city");
const targetTemperature = document.querySelector("#temp");
const cityHumidity = document.querySelector("#Humidity");
const feel = document.querySelector("#feel");
const cityRegion = document.querySelector("#region");
const windSpeed = document.querySelector("#wspeed");
const windDirection = document.querySelector("#wdirection");
const C_latitude = document.querySelector("#lat");
const C_longitude = document.querySelector("#lon");
const cityPressure = document.querySelector("#Pressure");
const cityDate = document.querySelector("#date");
const cityTime = document.querySelector("#time");
const cityCountry = document.querySelector("#Country");
const search = document.querySelector("#search_area");
const form = document.querySelector(".d-flex");

form.addEventListener("submit", searchForLocation);

let target;

function searchForLocation(e) {
  e.preventDefault();
  target = search.value;
  getData(target);
}

const getData = async (targetplace) => {
  let url = `https://api.weatherapi.com/v1/current.json?key=257ec1a236b94689af3104504251405&q=${targetplace}&aqi=no`;

  try {
    
    const response = await fetch(url);
    const data = await response.json();

    const region = data.location.region;
    const temperature = data.current.temp_c;
    const feelslike = data.current.feelslike_c;
    const humidity = data.current.humidity;
    const Wspeed = data.current.wind_kph;
    const wdirection = data.current.wind_dir;
    const pressure = data.current.pressure_mb;
    const latitude = data.location.lat;
    const longitude = data.location.lon;
    const localTime = data.location.localtime;
    const Country = data.location.country;
    const condition = data.current.condition.text;

    updateValues(
      temperature,
      feelslike,
      humidity,
      Wspeed,
      wdirection,
      pressure,
      region,
      latitude,
      longitude,
      localTime,
      Country,
      condition,
      target
    );
  } catch (error) {
    alert("City not found. Please check the name.");
  }
};

const updateValues = (
  temperature,
  feelslike,
  humidity,
  Wspeed,
  wdirection,
  pressure,
  region,
  latitude,
  longitude,
  localTime,
  Country,
  condition,
  target
) => {
  targetTemperature.innerText = temperature;
  feel.innerText = feelslike;
  cityHumidity.innerText = humidity;
  windSpeed.innerText = Wspeed;
  windDirection.innerText = wdirection;
  cityRegion.innerText = region;
  cityPressure.innerText = pressure;
  C_latitude.innerText = latitude;
  C_longitude.innerText = longitude;

  const [date, time] = localTime.split(" ");
  cityDate.innerText = date;
  cityTime.innerText = time;
  cityCountry.innerText = Country;

  city.innerText = target;
  about_city.innerText = target;
};
const updateTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  cityTime.innerText = `${hours}:${minutes}:${seconds}`;
};
