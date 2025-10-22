import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherWidget from './WeatherWidget';
import { WeatherService } from '../services/weatherService';
import { TemperatureUnit } from '../types/weather';

// Mock the WeatherService
jest.mock('../services/weatherService');
const mockWeatherService = WeatherService as jest.Mocked<typeof WeatherService>;

// Mock the static methods properly
mockWeatherService.getTemperatureSymbol = jest.fn((unit) => unit === 'celsius' ? '°C' : '°F');

describe('WeatherWidget - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    mockWeatherService.getTemperatureSymbol.mockImplementation((unit) => unit === 'celsius' ? '°C' : '°F');
  });

  test('complete user workflow: search city, view weather, toggle units, see alerts', async () => {
    const user = userEvent.setup();
    
    // Mock weather data with extreme conditions to trigger all alerts
    const mockWeatherDataCelsius = {
      name: 'Arctic City',
      sys: { country: 'AC' },
      main: {
        temp: -10,
        humidity: 95,
        feels_like: -15
      },
      weather: [{
        main: 'Storm',
        description: 'heavy thunderstorm',
        icon: '11d'
      }],
      rain: {
        '1h': 20
      }
    };

    // Mock Fahrenheit data (same city, different unit)
    const mockWeatherDataFahrenheit = {
      ...mockWeatherDataCelsius,
      main: {
        temp: 14, // -10°C in Fahrenheit
        humidity: 95,
        feels_like: 5 // -15°C in Fahrenheit
      }
    };

    // Set up API mocks for different units
    mockWeatherService.fetchWeatherData
      .mockImplementation((city: string, unit?: TemperatureUnit) => {
        if (unit === 'celsius' || !unit) {
          return new Promise(resolve => setTimeout(() => resolve(mockWeatherDataCelsius), 50));
        } else {
          return new Promise(resolve => setTimeout(() => resolve(mockWeatherDataFahrenheit), 50));
        }
      });

    render(<WeatherWidget />);

    // Step 1: Verify initial state
    expect(screen.getByText('🌤️ Weather App')).toBeInTheDocument();
    expect(screen.getByTestId('city-input')).toHaveValue('');
    expect(screen.getByTestId('search-button')).toBeDisabled();
    expect(screen.getByTestId('unit-toggle')).toHaveTextContent('°C | °F');

    // Step 2: Enter city name
    const cityInput = screen.getByTestId('city-input');
    await user.type(cityInput, 'Arctic City');
    
    expect(cityInput).toHaveValue('Arctic City');
    expect(screen.getByTestId('search-button')).not.toBeDisabled();

    // Step 3: Search for weather (Celsius by default)
    const searchButton = screen.getByTestId('search-button');
    await user.click(searchButton);

    // Verify loading state appears
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.getByText('Fetching weather data...')).toBeInTheDocument();

    // Step 4: Wait for and verify weather data is displayed
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      expect(screen.getByTestId('weather-content')).toBeInTheDocument();
    });

    // Verify location display
    expect(screen.getByText('📍 Arctic City, AC')).toBeInTheDocument();

    // Verify temperature display (Celsius)
    expect(screen.getByTestId('temperature')).toHaveTextContent('-10°C');
    expect(screen.getByText('Feels like -15°C')).toBeInTheDocument();

    // Verify weather condition
    expect(screen.getByTestId('weather-condition')).toHaveTextContent('Storm');
    expect(screen.getByText('heavy thunderstorm')).toBeInTheDocument();

    // Verify weather details
    expect(screen.getByTestId('humidity')).toHaveTextContent('95%');
    expect(screen.getByTestId('rain')).toHaveTextContent('20mm');

    // Step 5: Verify all weather alerts are displayed
    expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
    
    // Check for all three types of alerts
    expect(screen.getByTestId('alert-high-humidity')).toBeInTheDocument();
    expect(screen.getByText(/High humidity alert.*95%/)).toBeInTheDocument();
    
    expect(screen.getByTestId('alert-heavy-rain')).toBeInTheDocument();
    expect(screen.getByText(/Heavy rain alert.*20mm/)).toBeInTheDocument();
    
    expect(screen.getByTestId('alert-extreme-temperature')).toBeInTheDocument();
    expect(screen.getByText(/Freezing alert.*-10.0°C/)).toBeInTheDocument();

    // Step 6: Toggle to Fahrenheit
    const unitToggle = screen.getByTestId('unit-toggle');
    await user.click(unitToggle);

    // Verify unit toggle state changed
    expect(unitToggle).toHaveClass('weather-widget__toggle-btn--fahrenheit');

    // Step 7: Verify alerts updated for Fahrenheit (no re-fetch needed)
    await waitFor(() => {
      expect(screen.getByText(/Freezing alert.*-10.0°F/)).toBeInTheDocument();
    });

    // Step 10: Toggle back to Celsius
    await user.click(unitToggle);
    expect(unitToggle).toHaveClass('weather-widget__toggle-btn--celsius');

    // Step 11: Test keyboard interaction (Enter key)
    await user.clear(cityInput);
    await user.type(cityInput, 'Another City');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledWith('Another City', 'celsius');
    });

    // Verify API was called with correct parameters throughout the test
    expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledTimes(2);
    expect(mockWeatherService.fetchWeatherData).toHaveBeenNthCalledWith(1, 'Arctic City', 'celsius');
    expect(mockWeatherService.fetchWeatherData).toHaveBeenNthCalledWith(2, 'Another City', 'celsius');
  });

  test('user workflow with API error and recovery', async () => {
    const user = userEvent.setup();
    
    const mockWeatherData = {
      name: 'London',
      sys: { country: 'GB' },
      main: {
        temp: 20,
        humidity: 60,
        feels_like: 19
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }]
    };

    // First call fails, second succeeds
    mockWeatherService.fetchWeatherData
      .mockRejectedValueOnce(new Error('City not found. Please check the spelling and try again.'))
      .mockResolvedValueOnce(mockWeatherData);

    render(<WeatherWidget />);

    // Step 1: Search for invalid city
    const cityInput = screen.getByTestId('city-input');
    const searchButton = screen.getByTestId('search-button');
    
    await user.type(cityInput, 'InvalidCity');
    await user.click(searchButton);

    // Step 2: Verify error is displayed
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText('City not found. Please check the spelling and try again.')).toBeInTheDocument();
    });

    // Verify no weather content is shown
    expect(screen.queryByTestId('weather-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('weather-alerts')).not.toBeInTheDocument();

    // Step 3: Clear and search for valid city
    await user.clear(cityInput);
    await user.type(cityInput, 'London');
    await user.click(searchButton);

    // Step 4: Verify error is cleared and weather data is shown
    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
      expect(screen.getByTestId('weather-content')).toBeInTheDocument();
    });

    expect(screen.getByText('📍 London, GB')).toBeInTheDocument();
    expect(screen.getByTestId('temperature')).toHaveTextContent('20°C');
    
    // Verify no alerts for normal conditions
    expect(screen.queryByTestId('weather-alerts')).not.toBeInTheDocument();
  });

  test('user workflow with no rain data', async () => {
    const user = userEvent.setup();
    
    const mockWeatherDataNoRain = {
      name: 'Sunny City',
      sys: { country: 'SC' },
      main: {
        temp: 25,
        humidity: 45,
        feels_like: 24
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }]
      // No rain property
    };

    mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherDataNoRain);

    render(<WeatherWidget />);

    // Search for city
    const cityInput = screen.getByTestId('city-input');
    const searchButton = screen.getByTestId('search-button');
    
    await user.type(cityInput, 'Sunny City');
    await user.click(searchButton);

    // Verify weather data is displayed
    await waitFor(() => {
      expect(screen.getByTestId('weather-content')).toBeInTheDocument();
    });

    // Verify rain shows "No rain" when no rain data
    expect(screen.getByTestId('rain')).toHaveTextContent('No rain');
    
    // Verify no alerts for normal conditions
    expect(screen.queryByTestId('weather-alerts')).not.toBeInTheDocument();
  });

  test('user can clear input and search for different cities', async () => {
    const user = userEvent.setup();
    
    const mockLondonData = {
      name: 'London',
      sys: { country: 'GB' },
      main: { temp: 15, humidity: 65, feels_like: 14 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
    };

    const mockTokyoData = {
      name: 'Tokyo',
      sys: { country: 'JP' },
      main: { temp: 28, humidity: 75, feels_like: 30 },
      weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }]
    };

    mockWeatherService.fetchWeatherData
      .mockResolvedValueOnce(mockLondonData)
      .mockResolvedValueOnce(mockTokyoData);

    render(<WeatherWidget />);

    const cityInput = screen.getByTestId('city-input');
    const searchButton = screen.getByTestId('search-button');

    // Search for London
    await user.type(cityInput, 'London');
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('📍 London, GB')).toBeInTheDocument();
      expect(screen.getByTestId('temperature')).toHaveTextContent('15°C');
    });

    // Clear and search for Tokyo
    await user.clear(cityInput);
    await user.type(cityInput, 'Tokyo');
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('📍 Tokyo, JP')).toBeInTheDocument();
      expect(screen.getByTestId('temperature')).toHaveTextContent('28°C');
    });

    // Verify both API calls were made
    expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledTimes(2);
    expect(mockWeatherService.fetchWeatherData).toHaveBeenNthCalledWith(1, 'London', 'celsius');
    expect(mockWeatherService.fetchWeatherData).toHaveBeenNthCalledWith(2, 'Tokyo', 'celsius');
  });
});