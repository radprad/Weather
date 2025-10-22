import { WeatherAlerts } from './weatherAlerts';
import { WeatherData, TemperatureUnit } from '../types/weather';

describe('WeatherAlerts', () => {
  const baseWeatherData: WeatherData = {
    name: 'Test City',
    sys: { country: 'TC' },
    main: {
      temp: 20,
      humidity: 50,
      feels_like: 19
    },
    weather: [{
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }]
  };

  describe('generateAlerts', () => {
    describe('High Humidity Alerts', () => {
      test('generates high humidity alert when humidity > 90%', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, humidity: 95 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('high-humidity');
        expect(alerts[0].message).toContain('High humidity alert');
        expect(alerts[0].message).toContain('95%');
      });

      test('does not generate humidity alert when humidity <= 90%', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, humidity: 90 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(0);
      });

      test('generates humidity alert at boundary (91%)', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, humidity: 91 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('high-humidity');
      });
    });

    describe('Heavy Rain Alerts', () => {
      test('generates heavy rain alert when rain > 10mm (1h)', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          rain: { '1h': 15 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('heavy-rain');
        expect(alerts[0].message).toContain('Heavy rain alert');
        expect(alerts[0].message).toContain('15mm');
      });

      test('generates heavy rain alert when rain > 10mm (3h)', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          rain: { '3h': 12 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('heavy-rain');
        expect(alerts[0].message).toContain('12mm');
      });

      test('prefers 1h rain data over 3h when both available', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          rain: { '1h': 15, '3h': 12 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].message).toContain('15mm');
      });

      test('does not generate rain alert when rain <= 10mm', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          rain: { '1h': 10 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(0);
      });

      test('does not generate rain alert when no rain data', () => {
        const alerts = WeatherAlerts.generateAlerts(baseWeatherData, 'celsius');

        expect(alerts).toHaveLength(0);
      });

      test('generates rain alert at boundary (>10mm)', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          rain: { '1h': 10.1 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('heavy-rain');
      });
    });

    describe('Extreme Temperature Alerts - Celsius', () => {
      test('generates freezing alert when temp < 0°C', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: -5 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('extreme-temperature');
        expect(alerts[0].message).toContain('Freezing alert');
        expect(alerts[0].message).toContain('-5.0°C');
      });

      test('generates heat alert when temp > 40°C', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 45 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('extreme-temperature');
        expect(alerts[0].message).toContain('Extreme heat alert');
        expect(alerts[0].message).toContain('45.0°C');
      });

      test('does not generate temperature alert for normal range', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 25 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(0);
      });

      test('does not generate alert at boundaries (0°C and 40°C)', () => {
        const freezingBoundary: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 0 }
        };

        const heatBoundary: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 40 }
        };

        expect(WeatherAlerts.generateAlerts(freezingBoundary, 'celsius')).toHaveLength(0);
        expect(WeatherAlerts.generateAlerts(heatBoundary, 'celsius')).toHaveLength(0);
      });
    });

    describe('Extreme Temperature Alerts - Fahrenheit', () => {
      test('generates freezing alert when temp < 32°F', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 25 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'fahrenheit');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('extreme-temperature');
        expect(alerts[0].message).toContain('Freezing alert');
        expect(alerts[0].message).toContain('25.0°F');
      });

      test('generates heat alert when temp > 104°F', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 110 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'fahrenheit');

        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('extreme-temperature');
        expect(alerts[0].message).toContain('Extreme heat alert');
        expect(alerts[0].message).toContain('110.0°F');
      });

      test('does not generate alert at boundaries (32°F and 104°F)', () => {
        const freezingBoundary: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 32 }
        };

        const heatBoundary: WeatherData = {
          ...baseWeatherData,
          main: { ...baseWeatherData.main, temp: 104 }
        };

        expect(WeatherAlerts.generateAlerts(freezingBoundary, 'fahrenheit')).toHaveLength(0);
        expect(WeatherAlerts.generateAlerts(heatBoundary, 'fahrenheit')).toHaveLength(0);
      });
    });

    describe('Multiple Alerts', () => {
      test('generates multiple alerts when multiple conditions are met', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: {
            temp: -5,
            humidity: 95,
            feels_like: -6
          },
          rain: { '1h': 15 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts).toHaveLength(3);
        
        const alertTypes = alerts.map(alert => alert.type);
        expect(alertTypes).toContain('high-humidity');
        expect(alertTypes).toContain('heavy-rain');
        expect(alertTypes).toContain('extreme-temperature');
      });

      test('returns alerts in correct order', () => {
        const weatherData: WeatherData = {
          ...baseWeatherData,
          main: {
            temp: -5,
            humidity: 95,
            feels_like: -6
          },
          rain: { '1h': 15 }
        };

        const alerts = WeatherAlerts.generateAlerts(weatherData, 'celsius');

        expect(alerts[0].type).toBe('high-humidity');
        expect(alerts[1].type).toBe('heavy-rain');
        expect(alerts[2].type).toBe('extreme-temperature');
      });
    });
  });

  describe('getAlertClassName', () => {
    test('returns correct class for high-humidity alert', () => {
      const className = WeatherAlerts.getAlertClassName('high-humidity');
      expect(className).toBe('alert-humidity');
    });

    test('returns correct class for heavy-rain alert', () => {
      const className = WeatherAlerts.getAlertClassName('heavy-rain');
      expect(className).toBe('alert-rain');
    });

    test('returns correct class for extreme-temperature alert', () => {
      const className = WeatherAlerts.getAlertClassName('extreme-temperature');
      expect(className).toBe('alert-temperature');
    });

    test('returns default class for unknown alert type', () => {
      // @ts-ignore - Testing with invalid type
      const className = WeatherAlerts.getAlertClassName('unknown-type');
      expect(className).toBe('alert-general');
    });
  });
});