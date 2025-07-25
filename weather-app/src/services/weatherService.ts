import { WeatherData, TemperatureUnit } from '../types/weather';

const API_KEY = '15a3c18d4a8e8e5e53e0c3bdb7b4a7e8'; // Demo API key - replace with real one
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async fetchWeatherData(cityName: string, unit: TemperatureUnit = 'celsius'): Promise<WeatherData> {
    if (!cityName.trim()) {
      throw new Error('City name is required');
    }

    const units = unit === 'celsius' ? 'metric' : 'imperial';
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${units}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('API key is invalid. Please check your configuration.');
        } else {
          throw new Error(`Weather service error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  static convertTemperature(temp: number, fromUnit: TemperatureUnit, toUnit: TemperatureUnit): number {
    if (fromUnit === toUnit) return temp;

    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      return (temp - 32) * 5/9;
    }

    return temp;
  }

  static getTemperatureSymbol(unit: TemperatureUnit): string {
    return unit === 'celsius' ? '°C' : '°F';
  }
}