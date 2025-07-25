import { WeatherService } from './weatherService';

// Mock fetch globally
global.fetch = jest.fn();

describe('WeatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWeatherData', () => {
    const mockWeatherResponse = {
      cod: 200,
      name: 'London',
      sys: { country: 'GB' },
      main: {
        temp: 15,
        humidity: 65,
        feels_like: 14
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }]
    };

    test('fetches weather data successfully with celsius', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      });

      const result = await WeatherService.fetchWeatherData('London', 'celsius');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=London&appid=')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('units=metric')
      );
      expect(result).toEqual(mockWeatherResponse);
    });

    test('fetches weather data successfully with fahrenheit', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      });

      await WeatherService.fetchWeatherData('New York', 'fahrenheit');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=New%20York&appid=')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('units=imperial')
      );
    });

    test('throws error for empty city name', async () => {
      await expect(WeatherService.fetchWeatherData('', 'celsius'))
        .rejects.toThrow('City name is required');
      
      await expect(WeatherService.fetchWeatherData('   ', 'celsius'))
        .rejects.toThrow('City name is required');
    });

    test('handles 404 error (city not found)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(WeatherService.fetchWeatherData('InvalidCity', 'celsius'))
        .rejects.toThrow('City not found. Please check the spelling and try again.');
    });

    test('handles 401 error (invalid API key)', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(WeatherService.fetchWeatherData('London', 'celsius'))
        .rejects.toThrow('API key is invalid. Please check your configuration.');
    });

    test('handles other HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(WeatherService.fetchWeatherData('London', 'celsius'))
        .rejects.toThrow('Weather service error: 500');
    });

    test('handles API response with error code', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          cod: 404,
          message: 'city not found'
        }),
      });

      await expect(WeatherService.fetchWeatherData('InvalidCity', 'celsius'))
        .rejects.toThrow('city not found');
    });

    test('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(WeatherService.fetchWeatherData('London', 'celsius'))
        .rejects.toThrow('Network error');
    });

    test('handles unknown errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce('Unknown error');

      await expect(WeatherService.fetchWeatherData('London', 'celsius'))
        .rejects.toThrow('Network error. Please check your connection and try again.');
    });

    test('encodes city names with special characters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      });

      await WeatherService.fetchWeatherData('São Paulo', 'celsius');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=S%C3%A3o%20Paulo&appid=')
      );
    });
  });

  describe('convertTemperature', () => {
    test('converts celsius to fahrenheit correctly', () => {
      expect(WeatherService.convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
      expect(WeatherService.convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
      expect(WeatherService.convertTemperature(25, 'celsius', 'fahrenheit')).toBe(77);
      expect(WeatherService.convertTemperature(-10, 'celsius', 'fahrenheit')).toBe(14);
    });

    test('converts fahrenheit to celsius correctly', () => {
      expect(WeatherService.convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
      expect(WeatherService.convertTemperature(212, 'fahrenheit', 'celsius')).toBe(100);
      expect(WeatherService.convertTemperature(77, 'fahrenheit', 'celsius')).toBe(25);
      expect(WeatherService.convertTemperature(14, 'fahrenheit', 'celsius')).toBe(-10);
    });

    test('returns same temperature when units are the same', () => {
      expect(WeatherService.convertTemperature(25, 'celsius', 'celsius')).toBe(25);
      expect(WeatherService.convertTemperature(77, 'fahrenheit', 'fahrenheit')).toBe(77);
    });

    test('handles decimal temperatures correctly', () => {
      expect(WeatherService.convertTemperature(15.5, 'celsius', 'fahrenheit')).toBeCloseTo(59.9, 1);
      expect(WeatherService.convertTemperature(68.5, 'fahrenheit', 'celsius')).toBeCloseTo(20.28, 1);
    });
  });

  describe('getTemperatureSymbol', () => {
    test('returns correct symbol for celsius', () => {
      expect(WeatherService.getTemperatureSymbol('celsius')).toBe('°C');
    });

    test('returns correct symbol for fahrenheit', () => {
      expect(WeatherService.getTemperatureSymbol('fahrenheit')).toBe('°F');
    });
  });
});