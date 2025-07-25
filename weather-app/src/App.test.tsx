import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weather app', () => {
  render(<App />);
  expect(screen.getByText('🌤️ Weather App')).toBeInTheDocument();
  expect(screen.getByText('Get current weather information for any city')).toBeInTheDocument();
  expect(screen.getByText('Weather data provided by')).toBeInTheDocument();
});
