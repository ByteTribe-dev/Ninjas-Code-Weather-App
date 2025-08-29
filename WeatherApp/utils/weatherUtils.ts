import { TemperatureUnit, WeatherData } from '../types/weather';

export const convertTemperature = (celsius: number, unit: TemperatureUnit): number => {
  if (unit === 'F') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
};

export const getWeatherIcon = (weatherType: string): string => {
  const weatherIcons: { [key: string]: string } = {
    'Sunny': '☀️',
    'Cloudy': '☁️',
    'Partly Cloudy': '⛅',
    'Rainy': '🌧️',
    'Thunderstorm': '⛈️',
    'Humid': '💧',
    'Foggy': '🌫️',
    'Snowy': '❄️',
    'Windy': '💨',
    'Clear': '🌤️',
    'Overcast': '☁️',
    'Light Rain': '🌦️',
    'Heavy Rain': '🌧️',
    'Stormy': '⛈️',
    'Misty': '🌫️',
  };
  
  return weatherIcons[weatherType] || '🌤️';
};

export const getWeatherColor = (weatherType: string): string => {
  const weatherColors: { [key: string]: string } = {
    'Sunny': '#FFD700', // Bright Yellow
    'Clear': '#FFD700', // Bright Yellow
    'Cloudy': '#808080', // Gray
    'Overcast': '#696969', // Dim Gray
    'Partly Cloudy': '#A9A9A9', // Dark Gray
    'Rainy': '#4169E1', // Royal Blue
    'Light Rain': '#87CEEB', // Sky Blue
    'Heavy Rain': '#1E90FF', // Dodger Blue
    'Thunderstorm': '#483D8B', // Dark Slate Blue
    'Stormy': '#483D8B', // Dark Slate Blue
    'Humid': '#20B2AA', // Light Sea Green
    'Foggy': '#D3D3D3', // Light Gray
    'Misty': '#F0F8FF', // Alice Blue
    'Snowy': '#F0F8FF', // Alice Blue
    'Windy': '#87CEEB', // Sky Blue
  };
  
  return weatherColors[weatherType] || '#87CEEB';
};

export const getWeatherBackground = (weatherType: string): string => {
  const weatherBackgrounds: { [key: string]: string } = {
    'Sunny': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    'Clear': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    'Cloudy': 'linear-gradient(135deg, #808080 0%, #A9A9A9 50%, #C0C0C0 100%)',
    'Overcast': 'linear-gradient(135deg, #696969 0%, #808080 50%, #A9A9A9 100%)',
    'Partly Cloudy': 'linear-gradient(135deg, #A9A9A9 0%, #C0C0C0 50%, #D3D3D3 100%)',
    'Rainy': 'linear-gradient(135deg, #4169E1 0%, #1E90FF 50%, #00BFFF 100%)',
    'Light Rain': 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
    'Heavy Rain': 'linear-gradient(135deg, #1E90FF 0%, #4169E1 50%, #000080 100%)',
    'Thunderstorm': 'linear-gradient(135deg, #483D8B 0%, #2F4F4F 50%, #191970 100%)',
    'Stormy': 'linear-gradient(135deg, #483D8B 0%, #2F4F4F 50%, #191970 100%)',
    'Humid': 'linear-gradient(135deg, #20B2AA 0%, #48D1CC 50%, #7FFFD4 100%)',
    'Foggy': 'linear-gradient(135deg, #D3D3D3 0%, #F5F5F5 50%, #FFFFFF 100%)',
    'Misty': 'linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 50%, #F8F8FF 100%)',
    'Snowy': 'linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 50%, #F8F8FF 100%)',
    'Windy': 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
  };
  
  return weatherBackgrounds[weatherType] || 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)';
};

export const getWeatherCardStyle = (weatherType: string) => {
  const baseColor = getWeatherColor(weatherType);
  const backgroundColor = baseColor + '15'; // 15% opacity
  const borderColor = baseColor + '30'; // 30% opacity
  
  return {
    backgroundColor,
    borderColor,
    borderWidth: 1,
  };
};

export const getWeatherTextColor = (weatherType: string): string => {
  const darkWeatherTypes = ['Sunny', 'Clear', 'Partly Cloudy', 'Windy'];
  return darkWeatherTypes.includes(weatherType) ? '#333' : '#fff';
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

export const getWindDirection = (windSpeed: number): string => {
  if (windSpeed < 5) return 'Calm';
  if (windSpeed < 10) return 'Light breeze';
  if (windSpeed < 15) return 'Moderate breeze';
  if (windSpeed < 20) return 'Strong breeze';
  return 'High winds';
};

export const getHumidityLevel = (humidity: number): string => {
  if (humidity < 30) return 'Low';
  if (humidity < 60) return 'Moderate';
  if (humidity < 80) return 'High';
  return 'Very High';
};
