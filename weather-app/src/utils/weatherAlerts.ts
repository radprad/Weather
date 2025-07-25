import { WeatherData, WeatherAlert, TemperatureUnit } from '../types/weather';

export class WeatherAlerts {
  static generateAlerts(weatherData: WeatherData, unit: TemperatureUnit): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    // Check humidity > 90%
    if (weatherData.main.humidity > 90) {
      alerts.push({
        type: 'high-humidity',
        message: `⚠️ High humidity alert: ${weatherData.main.humidity}% humidity detected. Consider using a dehumidifier or ensuring proper ventilation.`
      });
    }

    // Check for heavy rain
    if (weatherData.rain) {
      const rainAmount = weatherData.rain['1h'] || weatherData.rain['3h'] || 0;
      if (rainAmount > 10) { // Heavy rain threshold (mm)
        alerts.push({
          type: 'heavy-rain',
          message: `🌧️ Heavy rain alert: ${rainAmount}mm of rain detected. Consider carrying an umbrella and avoid outdoor activities.`
        });
      }
    }

    // Check for extreme temperatures
    const temp = weatherData.main.temp;
    let isExtreme = false;
    let extremeMessage = '';

    if (unit === 'celsius') {
      if (temp < 0) {
        isExtreme = true;
        extremeMessage = `🥶 Freezing alert: ${temp.toFixed(1)}°C. Dress warmly and be cautious of icy conditions.`;
      } else if (temp > 40) {
        isExtreme = true;
        extremeMessage = `🥵 Extreme heat alert: ${temp.toFixed(1)}°C. Stay hydrated and avoid prolonged sun exposure.`;
      }
    } else {
      if (temp < 32) {
        isExtreme = true;
        extremeMessage = `🥶 Freezing alert: ${temp.toFixed(1)}°F. Dress warmly and be cautious of icy conditions.`;
      } else if (temp > 104) {
        isExtreme = true;
        extremeMessage = `🥵 Extreme heat alert: ${temp.toFixed(1)}°F. Stay hydrated and avoid prolonged sun exposure.`;
      }
    }

    if (isExtreme) {
      alerts.push({
        type: 'extreme-temperature',
        message: extremeMessage
      });
    }

    return alerts;
  }

  static getAlertClassName(alertType: WeatherAlert['type']): string {
    switch (alertType) {
      case 'high-humidity':
        return 'alert-humidity';
      case 'heavy-rain':
        return 'alert-rain';
      case 'extreme-temperature':
        return 'alert-temperature';
      default:
        return 'alert-general';
    }
  }
}