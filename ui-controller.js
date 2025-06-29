// ui-controller.js - UI Controller for weather app

class UIController {
  constructor() {
    this.temperatureUnit = 'C'; // C for Celsius, F for Fahrenheit
    this.speedUnit = 'kmh'; // kmh or mph
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.elements = {
      loader: document.getElementById('loader'),
      weatherContainer: document.getElementById('weatherContainer'),
      locationTitle: document.getElementById('locationTitle'),
      currentDateTime: document.getElementById('currentDateTime'),
      mainWeatherInfo: document.getElementById('mainWeatherInfo'),
      weatherDetails: document.getElementById('weatherDetails'),
      hourlyForecast: document.getElementById('hourlyForecast'),
      forecastContainer: document.getElementById('forecastContainer'),
      errorAlert: document.getElementById('errorAlert'),
      errorMessage: document.getElementById('errorMessage'),
      searchSuggestions: document.getElementById('searchSuggestions'),
      unitToggle: document.getElementById('unitToggle'),
      cityInput: document.getElementById('cityInput')
    };
  }

  bindEvents() {
    // Unit toggle
    this.elements.unitToggle.addEventListener('click', () => {
      this.toggleTemperatureUnit();
    });

    // Quick city buttons
    document.querySelectorAll('.quick-city-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const city = e.target.dataset.city;
        if (window.app) {
          window.app.searchCity(city);
        }
      });
    });

    // Hide search suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#cityInput') && !e.target.closest('#searchSuggestions')) {
        this.hideSearchSuggestions();
      }
    });
  }

  /**
   * STRICT LOCAL ICON MAPPING - NO EXTERNAL CALLS
   * Maps OpenWeatherMap icon codes to local PNG files only
   */
  getLocalWeatherIcon(iconCode) {
    console.log(`🎯 STRICT LOCAL: Mapping icon code "${iconCode}" to local file`);
    
    // Complete mapping of all OpenWeatherMap icon codes to local files
    const iconMap = {
      '01d': '01d.png', // clear sky day
      '01n': '01n.png', // clear sky night
      '02d': '02d.png', // few clouds day
      '02n': '02n.png', // few clouds night
      '03d': '03d.png', // scattered clouds day
      '03n': '03n.png', // scattered clouds night
      '04d': '04d.png', // broken clouds day
      '04n': '04n.png', // broken clouds night
      '09d': '09d.png', // shower rain day
      '09n': '09n.png', // shower rain night
      '10d': '10d.png', // rain day
      '10n': '10n.png', // rain night
      '11d': '11d.png', // thunderstorm day
      '11n': '11n.png', // thunderstorm night
      '13d': '13d.png', // snow day
      '13n': '13n.png', // snow night
      '50d': '50d.png', // mist day
      '50n': '50n.png'  // mist night
    };

    // Get the local icon file or fallback to unknown
    const iconFile = iconMap[iconCode] || 'unknown.png';
    const localPath = `icons/${iconFile}`;
    
    console.log(`✅ LOCAL ICON: "${iconCode}" → "${localPath}"`);
    return localPath;
  }

  /**
   * STRICT LOCAL ICON CREATION - NO EXTERNAL DEPENDENCIES
   * Creates weather icon HTML using only local PNG files
   */
  createWeatherIcon(iconCode, condition, description, size = 'large') {
    // Get the local icon path (NEVER external)
    const iconPath = this.getLocalWeatherIcon(iconCode);
    
    let cssClass = 'weather-icon-img';
    
    // Apply size-specific classes
    switch(size) {
      case 'small':
        cssClass += ' weather-icon-small';
        break;
      case 'medium':
        cssClass += ' weather-icon-medium';
        break;
      case 'large':
      default:
        cssClass += ' weather-icon-large';
        break;
    }

    // Create the icon HTML with strict local path and fallback
    const iconHTML = `<img src="${iconPath}" 
                           alt="${description || condition}" 
                           title="${description || condition}"
                           class="${cssClass}"
                           onerror="this.src='icons/unknown.png'; console.error('❌ ICON LOAD FAILED: ${iconPath}');" 
                           onload="console.log('✅ ICON LOADED: ${iconPath}');" />`;

    console.log(`🖼️ CREATED LOCAL ICON: ${iconPath} (${size})`);
    return iconHTML;
  }

  showLoader() {
    this.elements.loader.style.display = 'block';
    this.elements.weatherContainer.style.display = 'none';
    this.hideError();
  }

  hideLoader() {
    this.elements.loader.style.display = 'none';
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorAlert.style.display = 'block';
    this.elements.errorAlert.classList.add('show');
    this.hideLoader();
  }

  hideError() {
    this.elements.errorAlert.style.display = 'none';
    this.elements.errorAlert.classList.remove('show');
  }

  toggleTemperatureUnit() {
    this.temperatureUnit = this.temperatureUnit === 'C' ? 'F' : 'C';
    this.speedUnit = this.temperatureUnit === 'C' ? 'kmh' : 'mph';
    this.elements.unitToggle.textContent = `°${this.temperatureUnit}`;
    
    // Re-render weather data with new units if data exists
    if (this.currentWeatherData) {
      this.updateWeatherDisplay(this.currentWeatherData);
    }
  }

  updateWeatherDisplay(weatherData) {
    this.currentWeatherData = weatherData;
    const { current, forecast, cityName } = weatherData;

    console.log('🌤️ UPDATING WEATHER DISPLAY - USING STRICT LOCAL ICONS');

    this.hideLoader();
    this.elements.weatherContainer.style.display = 'block';
    this.elements.weatherContainer.classList.add('fade-in-up');

    // Update location and time
    this.updateLocationAndTime(current, cityName);

    // Update main weather info
    this.updateMainWeatherInfo(current);

    // Update weather details
    this.updateWeatherDetails(current);

    // Update hourly forecast
    this.updateHourlyForecast(forecast);

    // Update daily forecast
    this.updateDailyForecast(forecast);

    // Update background
    this.updateBackground(current.weather[0].main.toLowerCase());
  }

  updateLocationAndTime(current, cityName) {
    const name = cityName || current.name;
    const country = current.sys.country;
    
    this.elements.locationTitle.innerHTML = `
      <i class="bi bi-geo-alt-fill me-2"></i>
      ${name}, ${country}
    `;

    const currentTime = WeatherUtils.formatDateTime(Date.now() / 1000, current.timezone);
    this.elements.currentDateTime.textContent = currentTime;
  }

  updateMainWeatherInfo(current) {
    const temp = WeatherUtils.formatTemperature(current.main.temp, this.temperatureUnit);
    const feelsLike = WeatherUtils.formatTemperature(current.main.feels_like, this.temperatureUnit);
    const condition = current.weather[0].main;
    const description = current.weather[0].description;
    const icon = current.weather[0].icon;

    console.log('🎯 MAIN WEATHER - Using local icon for:', icon);

    this.elements.mainWeatherInfo.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-6 text-center mb-3 mb-md-0">
          <div class="weather-icon-container">
            ${this.createWeatherIcon(icon, condition, description, 'large')}
          </div>
        </div>
        <div class="col-md-6 text-center">
          <div class="temperature">${temp}</div>
          <div class="feels-like mb-2">Feels like ${feelsLike}</div>
          <h4 class="mb-1">${condition}</h4>
          <p class="text-capitalize mb-0 opacity-75">${description}</p>
        </div>
      </div>
    `;
  }

  updateWeatherDetails(current) {
    const details = [
      {
        icon: 'bi-droplet-fill',
        label: 'Humidity',
        value: `${current.main.humidity}%`
      },
      {
        icon: 'bi-speedometer2',
        label: 'Pressure',
        value: `${current.main.pressure} hPa`
      },
      {
        icon: 'bi-wind',
        label: 'Wind Speed',
        value: WeatherUtils.formatSpeed(current.wind.speed * 3.6, this.speedUnit)
      },
      {
        icon: 'bi-compass',
        label: 'Wind Direction',
        value: `${WeatherUtils.getWindDirection(current.wind.deg)} (${current.wind.deg}°)`
      },
      {
        icon: 'bi-eye-fill',
        label: 'Visibility',
        value: `${(current.visibility / 1000).toFixed(1)} km`
      },
      {
        icon: 'bi-thermometer-half',
        label: 'Min / Max',
        value: `${WeatherUtils.formatTemperature(current.main.temp_min, this.temperatureUnit)} / ${WeatherUtils.formatTemperature(current.main.temp_max, this.temperatureUnit)}`
      }
    ];

    this.elements.weatherDetails.innerHTML = details.map(detail => `
      <div class="col-lg-2 col-md-4 col-sm-6">
        <div class="card weather-detail-card">
          <i class="${detail.icon}"></i>
          <div class="weather-detail-value">${detail.value}</div>
          <div class="weather-detail-label">${detail.label}</div>
        </div>
      </div>
    `).join('');
  }

  updateHourlyForecast(forecast) {
    const hourlyData = forecast.list.slice(0, 8); // Next 24 hours (8 * 3-hour intervals)
    
    console.log('⏰ HOURLY FORECAST - Using local icons for all hours');
    
    this.elements.hourlyForecast.innerHTML = hourlyData.map(hour => {
      const time = WeatherUtils.formatTime(hour.dt, forecast.city.timezone);
      const temp = WeatherUtils.formatTemperature(hour.main.temp, this.temperatureUnit);
      const icon = hour.weather[0].icon;
      const condition = hour.weather[0].main;
      const description = hour.weather[0].description;

      console.log(`⏰ HOURLY ${time} - Local icon: ${icon}`);

      return `
        <div class="col-auto">
          <div class="card hourly-forecast-card">
            <div class="hourly-time">${time}</div>
            <div class="text-center mb-2">
              ${this.createWeatherIcon(icon, condition, description, 'small')}
            </div>
            <div class="hourly-temp">${temp}</div>
            <div class="text-small opacity-75">${condition}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  updateDailyForecast(forecast) {
    const dailyData = {};
    
    // Group forecast data by date
    forecast.list.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date: entry.dt,
          temps: [],
          weather: entry.weather[0],
          timezone: forecast.city.timezone
        };
      }
      dailyData[date].temps.push(entry.main.temp);
    });

    // Get next 5 days
    const days = Object.values(dailyData).slice(0, 5);
    
    console.log('📅 DAILY FORECAST - Using local icons for all days');
    
    this.elements.forecastContainer.innerHTML = days.map(day => {
      const dayName = WeatherUtils.getDayName(day.date, day.timezone);
      const minTemp = WeatherUtils.formatTemperature(Math.min(...day.temps), this.temperatureUnit);
      const maxTemp = WeatherUtils.formatTemperature(Math.max(...day.temps), this.temperatureUnit);
      const icon = day.weather.icon;
      const condition = day.weather.main;
      const description = day.weather.description;

      console.log(`📅 ${dayName} - Local icon: ${icon}`);

      return `
        <div class="col-lg-2 col-md-4 col-sm-6">
          <div class="card forecast-card">
            <div class="forecast-day">${dayName}</div>
            <div class="text-center mb-2">
              ${this.createWeatherIcon(icon, condition, description, 'medium')}
            </div>
            <div class="mt-2">${condition}</div>
            <div class="forecast-temps">
              <span class="temp-high">${maxTemp}</span>
              <span class="temp-low">${minTemp}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  updateBackground(condition) {
    // Remove existing weather classes
    document.body.classList.remove('clear', 'clouds', 'rain', 'snow', 'mist', 'haze', 'thunderstorm');
    
    // Add new weather class
    document.body.classList.add(condition);
  }

  showSearchSuggestions(cities) {
    if (!cities || cities.length === 0) {
      this.hideSearchSuggestions();
      return;
    }

    const suggestionsHTML = cities.map(city => {
      const displayName = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
      return `
        <div class="suggestion-item" data-lat="${city.lat}" data-lon="${city.lon}" data-name="${city.name}">
          <i class="bi bi-geo-alt me-2"></i>
          ${displayName}
        </div>
      `;
    }).join('');

    this.elements.searchSuggestions.innerHTML = suggestionsHTML;
    this.elements.searchSuggestions.style.display = 'block';

    // Add click handlers to suggestions
    this.elements.searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const lat = parseFloat(item.dataset.lat);
        const lon = parseFloat(item.dataset.lon);
        const name = item.dataset.name;
        
        if (window.app) {
          window.app.fetchWeatherByCoords(lat, lon, name);
        }
        
        this.elements.cityInput.value = name;
        this.hideSearchSuggestions();
      });
    });
  }

  hideSearchSuggestions() {
    this.elements.searchSuggestions.style.display = 'none';
    this.elements.searchSuggestions.innerHTML = '';
  }
}

// Export for use in other files
window.UIController = UIController;