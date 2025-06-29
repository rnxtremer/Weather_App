// app.js - Main application controller

class WeatherApp {
  constructor() {
    this.weatherService = new WeatherService();
    this.uiController = new UIController();
    this.currentLocation = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadInitialWeather();
  }

  bindEvents() {
    // Search form submission
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = document.getElementById('cityInput').value.trim();
      if (city) {
        this.searchCity(city);
      }
    });

    // Search input for suggestions
    const cityInput = document.getElementById('cityInput');
    const debouncedSearch = WeatherUtils.debounce(async (query) => {
      if (query.length >= 2) {
        try {
          const cities = await this.weatherService.searchCities(query);
          this.uiController.showSearchSuggestions(cities);
        } catch (error) {
          console.error('Error fetching city suggestions:', error);
        }
      } else {
        this.uiController.hideSearchSuggestions();
      }
    }, 300);

    cityInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });

    // Clear search suggestions on escape
    cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.uiController.hideSearchSuggestions();
      }
    });
  }

  async loadInitialWeather() {
    this.uiController.showLoader();
    
    try {
      // Try to get user's current location
      const position = await this.weatherService.getCurrentPosition();
      await this.fetchWeatherByCoords(position.lat, position.lon);
    } catch (error) {
      console.warn('Geolocation failed:', error.message);
      // Fallback to default city
      try {
        await this.searchCity('Delhi');
      } catch (fallbackError) {
        this.uiController.showError('Unable to load weather data. Please check your internet connection and try again.');
      }
    }
  }

  async searchCity(cityName) {
    this.uiController.showLoader();
    
    try {
      const result = await this.weatherService.getWeatherByCity(cityName);
      await this.fetchWeatherByCoords(result.coords.lat, result.coords.lon, cityName);
      
      // Clear search input
      document.getElementById('cityInput').value = '';
      this.uiController.hideSearchSuggestions();
      
    } catch (error) {
      console.error('Error searching city:', error);
      this.uiController.showError(error.message || 'City not found. Please check the spelling and try again.');
    }
  }

  async fetchWeatherByCoords(lat, lon, cityName = null) {
    this.uiController.showLoader();
    
    try {
      const weatherData = await this.weatherService.getCompleteWeatherData(lat, lon, cityName);
      this.currentLocation = { lat, lon, name: weatherData.cityName };
      this.uiController.updateWeatherDisplay(weatherData);
      
      // Show success notification for manual searches
      if (cityName) {
        WeatherUtils.showNotification(`Weather updated for ${weatherData.cityName}`, 'success');
      }
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      this.uiController.showError('Unable to fetch weather data. Please try again later.');
    }
  }

  async refreshWeather() {
    if (this.currentLocation) {
      await this.fetchWeatherByCoords(
        this.currentLocation.lat, 
        this.currentLocation.lon, 
        this.currentLocation.name
      );
      WeatherUtils.showNotification('Weather data refreshed', 'info');
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WeatherApp();
  
  // Add refresh functionality (optional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
      e.preventDefault();
      if (window.app) {
        window.app.refreshWeather();
      }
    }
  });
});

// Handle online/offline status
window.addEventListener('online', () => {
  WeatherUtils.showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
  WeatherUtils.showNotification('No internet connection', 'warning');
});