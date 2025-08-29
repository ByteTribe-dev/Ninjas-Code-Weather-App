# Weather App 🌤️

A beautiful and feature-rich weather application built with React Native and Expo.

## Features ✨

- **🌍 City Search**: Search for any city and get detailed weather information
- **⭐ Favorites**: Mark cities as favorites for quick access
- **🔄 Recent Searches**: View and manage your recent searches
- **🌡️ Temperature Toggle**: Switch between Celsius and Fahrenheit
- **📍 Current Location**: Get weather for your current location
- **📱 Responsive Design**: Beautiful UI that works on all screen sizes
- **🌙 Dark/Light Mode**: Automatic theme switching based on time
- **💾 Offline Support**: Cached data for offline viewing
- **🔄 Pull-to-Refresh**: Refresh weather data with a simple swipe

## Tech Stack 🛠️

- **React Native** with **Expo**
- **TypeScript** for type safety
- **AsyncStorage** for data persistence
- **JSON Server** for local API simulation
- **Expo Location** for GPS functionality
- **React Context** for state management

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WeatherApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server** (in a separate terminal)
   ```bash
   npm run json-server
   ```
   This will start a local server at `http://localhost:3001` serving the weather data.

4. **Start the Expo development server**
   ```bash
   npm start
   ```

5. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your phone

## Project Structure 📁

```
WeatherApp/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Main weather screen
│   │   └── favorites.tsx  # Favorites screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── WeatherCard.tsx    # Weather display card
│   ├── SearchBar.tsx      # City search component
│   ├── RecentSearches.tsx # Recent searches list
│   └── TemperatureToggle.tsx # Temperature unit toggle
├── context/              # React Context
│   └── WeatherContext.tsx # Weather state management
├── data/                 # Data files
│   └── weatherData.json  # Weather data (JSON Server)
├── types/                # TypeScript types
│   └── weather.ts        # Weather-related types
├── utils/                # Utility functions
│   └── weatherUtils.ts   # Weather calculations and helpers
└── package.json          # Dependencies and scripts
```

## Available Cities 🌆

The app includes weather data for the following cities:

- New York, USA
- London, UK
- Dubai, UAE
- Tokyo, Japan
- Paris, France
- Sydney, Australia
- Mumbai, India
- Toronto, Canada
- Berlin, Germany
- Singapore, Singapore

## Features in Detail 🔍

### 1. City Search & Weather Display
- Search for any city by name
- Display comprehensive weather information:
  - Temperature (°C/°F)
  - Weather condition with icons
  - Humidity levels
  - Wind speed and direction
  - Weather description

### 2. Recent Searches
- Automatically saves recent searches
- Quick access to previously searched cities
- Clear all recent searches option
- Optimized with memoization for performance

### 3. Temperature Unit Toggle
- Switch between Celsius and Fahrenheit
- Global state management with Context API
- Automatic conversion using the formula: °F = (°C × 9/5) + 32

### 4. Favorite Cities
- Mark cities as favorites with heart icon
- Dedicated favorites screen
- Quick access to favorite cities
- Remove from favorites functionality

### 5. Current Location
- Get weather for your current location
- Uses device GPS with permission handling
- Finds the closest city from available data

### 6. Offline Mode
- Caches weather data locally
- Shows last searched city when offline
- Persistent storage with AsyncStorage

### 7. UI Enhancements
- Weather-specific backgrounds and colors
- Smooth animations and transitions
- Responsive design for all screen sizes
- Pull-to-refresh functionality

## Weather Conditions 🌤️

The app supports various weather conditions with appropriate icons and colors:

- ☀️ Sunny (Yellow theme)
- ☁️ Cloudy (Gray theme)
- ⛅ Partly Cloudy (Light gray theme)
- 🌧️ Rainy (Blue theme)
- ⛈️ Thunderstorm (Dark blue theme)
- 💧 Humid (Teal theme)
- 🌫️ Foggy (Light gray theme)
- ❄️ Snowy (White theme)
- 💨 Windy (Sky blue theme)

## API Endpoints 📡

The app uses a local JSON Server with the following endpoints:

- `GET /weatherData` - Get all weather data
- `GET /weatherData/:id` - Get specific city weather data

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Weather icons from Expo Vector Icons
- Design inspiration from modern weather apps
- React Native community for excellent documentation

---

**Happy Weather Tracking! 🌤️**
