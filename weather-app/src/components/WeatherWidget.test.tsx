import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherWidget from './WeatherWidget';
import { WeatherService } from '../services/weatherService';

// Mock the WeatherService
jest.mock('../services/weatherService');
const mockWeatherService = WeatherService as jest.Mocked<typeof WeatherService>;

// Mock the static methods properly
mockWeatherService.getTemperatureSymbol = jest.fn((unit) => unit === 'celsius' ? '°C' : '°F');

// Mock weather data
const mockWeatherData = {
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
  }],
  rain: undefined
};

const mockWeatherDataWithHighHumidity = {
  ...mockWeatherData,
  main: {
    ...mockWeatherData.main,
    humidity: 95
  }
};

const mockWeatherDataWithRain = {
  ...mockWeatherData,
  rain: {
    '1h': 15
  }
};

const mockWeatherDataWithExtremeTemp = {
  ...mockWeatherData,
  main: {
    ...mockWeatherData.main,
    temp: -5
  }
};

describe('WeatherWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    mockWeatherService.getTemperatureSymbol.mockImplementation((unit) => unit === 'celsius' ? '°C' : '°F');
  });

  describe('Initial Render', () => {
    test('renders weather widget with initial elements', () => {
      render(<WeatherWidget />);
      
      expect(screen.getByText('🌤️ Weather App')).toBeInTheDocument();
      expect(screen.getByText('Get current weather information for any city')).toBeInTheDocument();
      expect(screen.getByTestId('city-input')).toBeInTheDocument();
      expect(screen.getByTestId('search-button')).toBeInTheDocument();
      expect(screen.getByTestId('unit-toggle')).toBeInTheDocument();
    });

    test('search button is disabled when input is empty', () => {
      render(<WeatherWidget />);
      
      const searchButton = screen.getByTestId('search-button');
      expect(searchButton).toBeDisabled();
    });

    test('search button is enabled when input has text', async () => {
      const user = userEvent.setup();
      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      expect(searchButton).not.toBeDisabled();
    });
  });

  describe('API Calls and Loading States', () => {
    test('shows loading indicator during API call', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 100))
      );

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      expect(screen.getByText('Fetching weather data...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
      });
    });

    test('displays weather data after successful API call', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherData);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('weather-content')).toBeInTheDocument();
        expect(screen.getByText('📍 London, GB')).toBeInTheDocument();
        expect(screen.getByTestId('temperature')).toHaveTextContent('15°C');
        expect(screen.getByTestId('weather-condition')).toHaveTextContent('Clear');
        expect(screen.getByTestId('humidity')).toHaveTextContent('65%');
      });
    });

    test('handles API errors gracefully', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockRejectedValue(new Error('City not found'));

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'InvalidCity');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText('City not found')).toBeInTheDocument();
      });
    });

    test('search button is disabled when input contains only whitespace', async () => {
      const user = userEvent.setup();
      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      // Initially disabled
      expect(searchButton).toBeDisabled();
      
      // Type something to enable button
      await user.type(input, 'test');
      expect(searchButton).not.toBeDisabled();
      
      // Clear and add only whitespace - should be disabled again
      await user.clear(input);
      await user.type(input, '   ');
      expect(searchButton).toBeDisabled();
    });
  });

  describe('Unit Toggle Functionality', () => {
    test('toggles between Celsius and Fahrenheit', async () => {
      const user = userEvent.setup();
      render(<WeatherWidget />);
      
      const unitToggle = screen.getByTestId('unit-toggle');
      
      // Initial state should be Celsius
      expect(unitToggle).toHaveTextContent('°C | °F');
      
      await user.click(unitToggle);
      
      // Should switch to Fahrenheit
      expect(unitToggle).toHaveClass('weather-widget__toggle-btn--fahrenheit');
      
      await user.click(unitToggle);
      
      // Should switch back to Celsius
      expect(unitToggle).toHaveClass('weather-widget__toggle-btn--celsius');
    });

    test('calls API with correct unit when toggling after search', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherData);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      const unitToggle = screen.getByTestId('unit-toggle');
      
      // First search with Celsius
      await user.type(input, 'London');
      await user.click(searchButton);
      
      expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledWith('London', 'celsius');
      
      // Toggle to Fahrenheit
      await user.click(unitToggle);
      
      // Search again
      await user.click(searchButton);
      
      expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledWith('London', 'fahrenheit');
    });
  });

  describe('Weather Alerts', () => {
    test('shows high humidity alert when humidity > 90%', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherDataWithHighHumidity);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
        expect(screen.getByTestId('alert-high-humidity')).toBeInTheDocument();
        expect(screen.getByText(/High humidity alert.*95%/)).toBeInTheDocument();
      });
    });

    test('shows heavy rain alert when rain > 10mm', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherDataWithRain);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('alert-heavy-rain')).toBeInTheDocument();
        expect(screen.getByText(/Heavy rain alert.*15mm/)).toBeInTheDocument();
      });
    });

    test('shows extreme temperature alert when temp < 0°C', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherDataWithExtremeTemp);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'Moscow');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('alert-extreme-temperature')).toBeInTheDocument();
        expect(screen.getByText(/Freezing alert.*-5.0°C/)).toBeInTheDocument();
      });
    });

    test('updates alerts when unit is toggled', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherDataWithExtremeTemp);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      const unitToggle = screen.getByTestId('unit-toggle');
      
      await user.type(input, 'Moscow');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Freezing alert.*-5.0°C/)).toBeInTheDocument();
      });
      
      // Toggle to Fahrenheit
      await user.click(unitToggle);
      
      await waitFor(() => {
        expect(screen.getByText(/Freezing alert.*-5.0°F/)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    test('triggers search when Enter key is pressed', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherData);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      
      await user.type(input, 'London');
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledWith('London', 'celsius');
      });
    });

    test('disables input and buttons during loading', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 100))
      );

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      const unitToggle = screen.getByTestId('unit-toggle');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      expect(input).toBeDisabled();
      expect(searchButton).toBeDisabled();
      expect(unitToggle).toBeDisabled();
      
      await waitFor(() => {
        expect(input).not.toBeDisabled();
        expect(searchButton).not.toBeDisabled();
        expect(unitToggle).not.toBeDisabled();
      });
    });
  });

  describe('Weather Data Display', () => {
    test('displays rain information when available', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherDataWithRain);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('rain')).toHaveTextContent('15mm');
      });
    });

    test('displays "No rain" when rain data is not available', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherData);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('rain')).toHaveTextContent('No rain');
      });
    });

    test('displays weather icon correctly', async () => {
      const user = userEvent.setup();
      mockWeatherService.fetchWeatherData.mockResolvedValue(mockWeatherData);

      render(<WeatherWidget />);
      
      const input = screen.getByTestId('city-input');
      const searchButton = screen.getByTestId('search-button');
      
      await user.type(input, 'London');
      await user.click(searchButton);
      
      await waitFor(() => {
        const weatherIcon = screen.getByTestId('weather-icon');
        expect(weatherIcon).toHaveAttribute('src', 'https://openweathermap.org/img/wn/01d@2x.png');
        expect(weatherIcon).toHaveAttribute('alt', 'clear sky');
      });
    });
  });
});