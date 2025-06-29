// weather-service.js - Weather API service

class WeatherService {
  constructor() {
    // TODO: Replace this with your actual OpenWeatherMap API key
    // Get your free API key from: https://openweathermap.org/api
    // 1. Sign up at openweathermap.org
    // 2. Go to API keys section in your account
    // 3. Generate a new API key
    // 4. Replace the key below (it may take a few minutes to activate)
    this.apiKey = "YOUR_API_KEY_HERE";
    this.baseURL = "https://api.openweathermap.org/data/2.5";
    this.geocodingURL = "https://api.openweathermap.org/geo/1.0";
  }

  async getCurrentWeather(lat, lon) {
    try {
      // Check if API key is still placeholder
      if (this.apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("Please replace 'YOUR_API_KEY_HERE' with a valid OpenWeatherMap API key. Get one free at https://openweathermap.org/api");
      }

      const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
      console.log('Fetching current weather from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key and ensure it is active.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  async getForecast(lat, lon) {
    try {
      // Check if API key is still placeholder
      if (this.apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("Please replace 'YOUR_API_KEY_HERE' with a valid OpenWeatherMap API key. Get one free at https://openweathermap.org/api");
      }

      const url = `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
      console.log('Fetching forecast from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key and ensure it is active.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  async getWeatherByCity(cityName) {
    try {
      // Check if API key is still placeholder
      if (this.apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("Please replace 'YOUR_API_KEY_HERE' with a valid OpenWeatherMap API key. Get one free at https://openweathermap.org/api");
      }

      const url = `${this.baseURL}/weather?q=${cityName}&units=metric&appid=${this.apiKey}`;
      console.log('Fetching weather by city from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key and ensure it is active.');
        }
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return {
        current: data,
        coords: { lat: data.coord.lat, lon: data.coord.lon }
      };
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  }

  async searchCities(query) {
    if (!query || query.length < 2) return [];
    
    try {
      if (this.apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("Please replace 'YOUR_API_KEY_HERE' with a valid OpenWeatherMap API key. Get one free at https://openweathermap.org/api");
      }

      const url = `${this.geocodingURL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`;
      console.log('Searching cities from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key and ensure it is active.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  async getCompleteWeatherData(lat, lon, cityName = null) {
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getForecast(lat, lon)
      ]);

      return {
        current: currentWeather,
        forecast: forecast,
        cityName: cityName || currentWeather.name
      };
    } catch (error) {
      console.error('Error fetching complete weather data:', error);
      throw error;
    }
  }

  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          let message = 'Unable to retrieve your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out.';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}

window.WeatherService = WeatherService;
