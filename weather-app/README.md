# Weather App

A modern, responsive React-based weather application that provides current weather information for any city worldwide. Built with TypeScript and featuring comprehensive testing coverage.

## 🌟 Features

### Core Functionality
- **City Search**: Enter any city name to get current weather information
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Loading Indicators**: Visual feedback during API calls
- **Error Handling**: Graceful error messages for invalid cities or network issues

### Weather Information Displayed
- **Temperature**: Current temperature with "feels like" information
- **Weather Condition**: Clear description of current weather (e.g., Clear, Cloudy, Storm)
- **Humidity**: Current humidity percentage
- **Precipitation**: Rain amount (when available) or "No rain" indicator
- **Weather Icon**: Visual representation from OpenWeatherMap

### Smart Weather Alerts
The app automatically shows alerts for potentially dangerous weather conditions:

- **🌧️ Heavy Rain Alert**: When rainfall > 10mm
- **⚠️ High Humidity Alert**: When humidity > 90%
- **🥶 Freezing Alert**: When temperature < 0°C (32°F)
- **🥵 Extreme Heat Alert**: When temperature > 40°C (104°F)

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Keyboard Support**: Press Enter to search
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key** (Important!)
   
   The app uses OpenWeatherMap API. You'll need to:
   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Replace the demo API key in `src/services/weatherService.ts`:
   
   ```typescript
   const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

This project includes comprehensive test coverage:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The app includes:

- **Unit Tests**: Individual component and service testing
- **Integration Tests**: Complete user workflow testing
- **API Testing**: Mock API responses and error handling
- **Alert Logic Testing**: Weather condition thresholds
- **Temperature Conversion Testing**: Unit toggle functionality

### Test Files

- `WeatherWidget.test.tsx` - Main component unit tests
- `WeatherWidget.integration.test.tsx` - End-to-end user workflows
- `weatherService.test.ts` - API service testing
- `weatherAlerts.test.ts` - Alert generation logic

## 🏗️ Building for Production

```bash
# Create production build
npm run build

# Serve production build locally (optional)
npx serve -s build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── WeatherWidget.tsx          # Main weather component
│   ├── WeatherWidget.css          # Component styles
│   ├── WeatherWidget.test.tsx     # Unit tests
│   └── WeatherWidget.integration.test.tsx # Integration tests
├── services/
│   ├── weatherService.ts          # API service
│   └── weatherService.test.ts     # Service tests
├── utils/
│   ├── weatherAlerts.ts           # Alert logic
│   └── weatherAlerts.test.ts      # Alert tests
├── types/
│   └── weather.ts                 # TypeScript interfaces
├── App.tsx                        # Main app component
├── App.css                        # Global styles
└── index.tsx                      # App entry point
```

## 🎨 Design Features

### Visual Design
- **Modern Gradient Backgrounds**: Beautiful blue gradient themes
- **Glass Morphism**: Semi-transparent elements with backdrop blur
- **Smooth Animations**: Loading spinners and slide-in effects
- **Responsive Grid**: Adaptive layout for all screen sizes

### User Interface
- **Intuitive Controls**: Clear input field and prominent search button
- **Visual Feedback**: Loading states and error messages
- **Temperature Toggle**: Easy unit switching with visual active state
- **Weather Icons**: Official OpenWeatherMap weather icons

## 🔧 Configuration

### API Configuration
The app uses OpenWeatherMap API with the following endpoints:
- Current Weather: `https://api.openweathermap.org/data/2.5/weather`

### Environment Variables (Optional)
You can optionally use environment variables:

Create a `.env` file in the root directory:
```
REACT_APP_WEATHER_API_KEY=your_api_key_here
REACT_APP_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

Then update `weatherService.ts` to use:
```typescript
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'fallback_key';
```

## 📱 Usage Examples

### Basic Search
1. Type a city name (e.g., "London", "New York", "Tokyo")
2. Click "Search" or press Enter
3. View weather information and any relevant alerts

### Unit Conversion
1. Search for any city
2. Click the temperature unit toggle (°C | °F)
3. Search again or view updated alert messages

### Handling Errors
- **Invalid City**: "City not found" message with suggestion to check spelling
- **Network Issues**: "Network error" message with retry suggestion
- **API Errors**: Specific error messages based on the issue

## 🛠️ Technical Details

### Technologies Used
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **CSS3**: Modern styling with animations
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Features
- **Efficient Re-renders**: React.memo and useCallback optimization
- **Loading States**: Prevents multiple simultaneous API calls
- **Error Boundaries**: Graceful error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Maintain responsive design
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [React](https://reactjs.org/) for the excellent framework
- [Create React App](https://create-react-app.dev/) for the project setup
