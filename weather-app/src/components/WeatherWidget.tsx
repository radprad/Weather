import React, { useState, useCallback } from 'react';
import { WeatherData, TemperatureUnit, WeatherAlert } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { WeatherAlerts } from '../utils/weatherAlerts';
import './WeatherWidget.css';

interface WeatherWidgetProps {
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = '' }) => {
  const [cityName, setCityName] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  const handleSearch = useCallback(async () => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setAlerts([]);

    try {
      const data = await WeatherService.fetchWeatherData(cityName, temperatureUnit);
      setWeatherData(data);
      
      const generatedAlerts = WeatherAlerts.generateAlerts(data, temperatureUnit);
      setAlerts(generatedAlerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [cityName, temperatureUnit]);

  const handleUnitToggle = useCallback(() => {
    const newUnit: TemperatureUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(newUnit);
    
    // If we have weather data, update alerts for new unit
    if (weatherData) {
      const updatedAlerts = WeatherAlerts.generateAlerts(weatherData, newUnit);
      setAlerts(updatedAlerts);
    }
  }, [temperatureUnit, weatherData]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}${WeatherService.getTemperatureSymbol(temperatureUnit)}`;
  };

  const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className={`weather-widget ${className}`}>
      <div className="weather-widget__header">
        <h1 className="weather-widget__title">🌤️ Weather App</h1>
        <p className="weather-widget__subtitle">Get current weather information for any city</p>
      </div>

      <div className="weather-widget__controls">
        <div className="weather-widget__search">
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name (e.g., London, New York)"
            className="weather-widget__input"
            disabled={loading}
            data-testid="city-input"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !cityName.trim()}
            className="weather-widget__search-btn"
            data-testid="search-button"
          >
            {loading ? '🔄' : '🔍'} Search
          </button>
        </div>

        <div className="weather-widget__unit-toggle">
          <label className="weather-widget__toggle-label">
            Temperature Unit:
            <button
              onClick={handleUnitToggle}
              className={`weather-widget__toggle-btn weather-widget__toggle-btn--${temperatureUnit}`}
              data-testid="unit-toggle"
              disabled={loading}
            >
              <span className={temperatureUnit === 'celsius' ? 'active' : ''}>°C</span>
              <span className="toggle-divider"> | </span>
              <span className={temperatureUnit === 'fahrenheit' ? 'active' : ''}>°F</span>
            </button>
          </label>
        </div>
      </div>

      {loading && (
        <div className="weather-widget__loading" data-testid="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      )}

      {error && (
        <div className="weather-widget__error" data-testid="error-message">
          <span className="error-icon">❌</span>
          <p>{error}</p>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="weather-widget__alerts" data-testid="weather-alerts">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`weather-alert ${WeatherAlerts.getAlertClassName(alert.type)}`}
              data-testid={`alert-${alert.type}`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {weatherData && !loading && (
        <div className="weather-widget__content" data-testid="weather-content">
          <div className="weather-widget__location">
            <h2 className="location-name">
              📍 {weatherData.name}, {weatherData.sys.country}
            </h2>
          </div>

          <div className="weather-widget__main">
            <div className="weather-main-info">
              <div className="weather-icon">
                <img
                  src={getWeatherIconUrl(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                  data-testid="weather-icon"
                />
              </div>
              <div className="weather-temp">
                <span className="temp-value" data-testid="temperature">
                  {formatTemperature(weatherData.main.temp)}
                </span>
                <span className="temp-feels-like">
                  Feels like {formatTemperature(weatherData.main.feels_like)}
                </span>
              </div>
            </div>

            <div className="weather-condition">
              <h3 data-testid="weather-condition">
                {weatherData.weather[0].main}
              </h3>
              <p className="condition-description">
                {weatherData.weather[0].description}
              </p>
            </div>
          </div>

          <div className="weather-widget__details">
            <div className="weather-detail">
              <span className="detail-icon">💧</span>
              <span className="detail-label">Humidity</span>
              <span className="detail-value" data-testid="humidity">
                {weatherData.main.humidity}%
              </span>
            </div>

            {weatherData.rain && (
              <div className="weather-detail">
                <span className="detail-icon">🌧️</span>
                <span className="detail-label">Rain</span>
                <span className="detail-value" data-testid="rain">
                  {weatherData.rain['1h'] || weatherData.rain['3h'] || 0}mm
                </span>
              </div>
            )}

            {!weatherData.rain && (
              <div className="weather-detail">
                <span className="detail-icon">☀️</span>
                <span className="detail-label">Rain</span>
                <span className="detail-value" data-testid="rain">
                  No rain
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;