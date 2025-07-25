import React from 'react';
import WeatherWidget from './components/WeatherWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <WeatherWidget />
        <footer className="app-footer">
          <p>
            Weather data provided by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
