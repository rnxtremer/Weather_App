// utils.js - Utility functions

class WeatherUtils {
  static formatTime(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static formatDate(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatDateTime(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static getDayName(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  }

  static getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  static getUVIndexLevel(uvIndex) {
    if (uvIndex <= 2) return { level: 'Low', color: 'success' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'warning' };
    if (uvIndex <= 7) return { level: 'High', color: 'orange' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'danger' };
    return { level: 'Extreme', color: 'purple' };
  }

  static getAirQualityLevel(aqi) {
    if (aqi <= 50) return { level: 'Good', color: 'success' };
    if (aqi <= 100) return { level: 'Moderate', color: 'warning' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'orange' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'danger' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'purple' };
    return { level: 'Hazardous', color: 'dark' };
  }

  static celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  static fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
  }

  static kmhToMph(kmh) {
    return kmh * 0.621371;
  }

  static mphToKmh(mph) {
    return mph * 1.60934;
  }

  static getWeatherIcon(condition, isDay = true) {
    const iconMap = {
      'clear': isDay ? 'bi-sun-fill' : 'bi-moon-stars-fill',
      'clouds': 'bi-clouds-fill',
      'rain': 'bi-cloud-rain-fill',
      'drizzle': 'bi-cloud-drizzle-fill',
      'thunderstorm': 'bi-cloud-lightning-fill',
      'snow': 'bi-cloud-snow-fill',
      'mist': 'bi-cloud-fog-fill',
      'haze': 'bi-cloud-haze-fill',
      'fog': 'bi-cloud-fog-fill'
    };
    
    return iconMap[condition.toLowerCase()] || 'bi-question-circle-fill';
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  static formatTemperature(temp, unit = 'C') {
    if (unit === 'F') {
      return `${Math.round(this.celsiusToFahrenheit(temp))}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  static formatSpeed(speed, unit = 'kmh') {
    if (unit === 'mph') {
      return `${Math.round(this.kmhToMph(speed))} mph`;
    }
    return `${Math.round(speed)} km/h`;
  }
}

// Export for use in other files
window.WeatherUtils = WeatherUtils;