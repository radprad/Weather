# Barclays UK Customer Journey Tube Map

A React Native application that visualizes Barclays UK customer journeys in an interactive tube map style interface. Built with Expo for cross-platform compatibility (iOS, Android, and Web).

## 🎯 Features

### Core Functionality
- **Interactive Tube Map Visualization**: 34 customer journeys displayed as interconnected nodes
- **Multi-platform Support**: Works on iOS, Android, and Web browsers via Expo/React Native Web
- **Zoom & Pan Controls**: Pinch-to-zoom and pan gestures for navigation
- **Layout Switching**: Toggle between horizontal and vertical map orientations

### Journey Management
- **Detailed Journey Views**: Comprehensive information about each customer journey
- **Sub-journey Exploration**: Drill down into journey components and workflows
- **Architecture Stack Visualization**: View UI → Mid-tier API → Database layers
- **Pain Point Annotations**: Identify and track journey friction points

### Advanced Features
- **Search & Filter**: Real-time search across journeys, epics, features, and stories
- **RAG Status Tracking**: Red/Amber/Green status indicators for portfolio epics
- **Metrics Dashboard**: Portfolio epics count, features, stories, and business outcomes
- **Domain Decomposition**: UK banking regulation-based journey breakdown
- **Dark/Light Theme**: Automatic theme switching with user preference persistence

### Technical Features
- **State Management**: Zustand for efficient global state management
- **Animated Interactions**: React Native Reanimated for smooth animations
- **SVG Visualizations**: React Native SVG for scalable graphics
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Offline Storage**: AsyncStorage for persisting user preferences

## 🏗️ Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety
- **State Management**: Zustand with persistence
- **Animations**: React Native Reanimated 3
- **Graphics**: React Native SVG
- **Gestures**: React Native Gesture Handler
- **Testing**: Jest + React Native Testing Library
- **Storage**: AsyncStorage for persistence

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── TubeMap/        # Main map visualization
│   ├── Search/         # Search functionality
│   ├── Filter/         # Filtering controls
│   ├── Journey/        # Journey detail views
│   └── ControlPanel/   # Map controls
├── screens/            # Main application screens
├── store/              # Zustand state management
├── types/              # TypeScript definitions
├── data/               # Mock data and API interfaces
└── utils/              # Utility functions
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI (optional, for additional development tools)

### Getting Started

1. **Clone and Install Dependencies**
   ```bash
   cd barclays-journey-map
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**
   ```bash
   # Start the Expo development server
   npm start
   
   # Or start specific platforms
   npm run android    # Android emulator/device
   npm run ios        # iOS simulator (macOS only)
   npm run web        # Web browser
   ```

3. **Platform-Specific Setup**
   
   **For iOS:**
   - Requires macOS with Xcode
   - iOS Simulator or physical device
   
   **For Android:**
   - Android Studio with emulator
   - Or physical Android device with USB debugging
   
   **For Web:**
   - Any modern web browser
   - Runs on http://localhost:8081 (or similar)

## 📱 Usage Guide

### Navigation
- **Zoom**: Pinch to zoom in/out or use control buttons
- **Pan**: Drag to move around the map
- **Reset View**: Tap the target button to reset zoom and position

### Journey Exploration
1. **Select a Journey**: Tap any journey node on the map
2. **View Details**: Tap "View Details" to see comprehensive information
3. **Explore Tabs**: Navigate between Overview, Epics, Architecture, Pain Points, and Domain tabs

### Search & Filter
- **Search**: Use the search bar to find specific journeys, epics, or features
- **Filter**: Tap the filter button to apply domain, RAG status, or other criteria
- **Clear**: Remove all filters with the "Clear All" button

### Customization
- **Theme**: Toggle between light and dark mode
- **Layout**: Switch between horizontal and vertical orientations
- **View Options**: Show/hide metrics, pain points, and architecture layers

## 📊 Data Structure

### Journey Schema
```typescript
interface Journey {
  id: string;
  name: string;
  description: string;
  domain: string;
  subJourneys: SubJourney[];
  architectureLayers: ArchitectureLayer[];
  painPoints: PainPoint[];
  epics: Epic[];
  metrics: JourneyMetrics;
  position: Position;
  capabilities: string[];
  domainDecomposition?: DomainDecomposition;
  connections: string[];
}
```

### Metrics Tracking
- **Portfolio Epics Count**: Number of associated epics
- **Linked Future Epics**: Planned dependencies
- **Business Outcome Mapping**: Strategic objectives
- **Features & Stories Count**: Development workload
- **RAG Status**: Health indicators (Red/Amber/Green)

## 🎨 UI/UX Design

### Design Principles
- **Tube Map Metaphor**: Familiar London Underground-style visualization
- **Responsive Layout**: Works across mobile, tablet, and desktop
- **Accessibility**: High contrast themes and clear typography
- **Performance**: Optimized for smooth interactions

### Color Scheme
- **RAG Status Colors**:
  - 🟢 Green: #4CAF50 (On track)
  - 🟡 Amber: #FF9800 (At risk)
  - 🔴 Red: #F44336 (Critical issues)
- **Connection Types**:
  - Dependency: Blue (#2196F3)
  - Sequence: Green (#4CAF50)
  - Integration: Orange (#FF9800)

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- **Unit Tests**: Component behavior and functionality
- **Integration Tests**: Store interactions and data flow
- **Component Tests**: UI rendering and user interactions

## 🔧 Development

### Adding New Journeys
1. **Update Mock Data**: Add journey objects to `src/data/mockData.ts`
2. **Define Architecture**: Include all relevant layers and technologies
3. **Set Connections**: Link related journeys via connection objects
4. **Test Integration**: Ensure new journeys appear correctly on the map

### Extending Metrics
1. **Update Types**: Modify `JourneyMetrics` interface in `src/types/index.ts`
2. **Update Store**: Add new metric handling in `src/store/tubeMapStore.ts`
3. **Update UI**: Modify components to display new metrics

### Custom Themes
1. **Define Colors**: Add theme constants to relevant components
2. **Update Store**: Extend theme options in the view state
3. **Apply Styling**: Use theme-aware styling throughout components

## 🚀 Deployment

### Web Deployment
```bash
# Build for web
npm run build:web

# Deploy to Expo hosting
npx expo export:web
```

### Mobile App Stores
```bash
# Build for iOS App Store
npx expo build:ios

# Build for Google Play Store
npx expo build:android
```

## 🔮 Future Enhancements

### Planned Features
- **Real-time Data Integration**: Connect to live Barclays APIs
- **Collaborative Annotations**: Team-based pain point tracking
- **Advanced Analytics**: Journey performance dashboards
- **AI-Powered Insights**: Automated journey optimization suggestions
- **Export Capabilities**: PDF reports and data exports

### API Integration Points
- **Journey Data**: Real-time journey status and metrics
- **User Management**: Authentication and role-based access
- **Analytics**: Usage tracking and performance monitoring
- **Notifications**: Real-time updates on journey changes

## 📄 License

This project is proprietary software developed for Barclays UK. All rights reserved.

## 👥 Contributing

For internal Barclays development:
1. Follow TypeScript best practices
2. Maintain test coverage above 80%
3. Use conventional commit messages
4. Update documentation for new features

## 📞 Support

For technical support or questions:
- Internal Slack: #barclays-journey-map
- Email: journey-map-team@barclays.com
- Documentation: Internal Confluence space

---

**Note**: This application contains mock data for demonstration purposes. Production deployment requires integration with actual Barclays systems and appropriate security measures.
