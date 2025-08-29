export interface WeatherData {
  id: number;
  city: string;
  country: string;
  temperature: number;
  weather: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RecentSearch {
  city: string;
  country: string;
  timestamp: number;
}

export interface FavoriteCity {
  city: string;
  country: string;
  weatherData: WeatherData;
  addedAt: number;
}

export type TemperatureUnit = "C" | "F";

export interface WeatherContextType {
  currentWeather: WeatherData | null;
  recentSearches: RecentSearch[];
  favoriteCities: FavoriteCity[];
  temperatureUnit: TemperatureUnit;
  isLoading: boolean;
  error: string | null;
  searchWeather: (cityName: string) => Promise<void>;
  addToFavorites: (weatherData: WeatherData) => void;
  removeFromFavorites: (cityName: string) => void;
  toggleTemperatureUnit: () => void;
  clearRecentSearches: () => void;
  getCurrentLocation: () => Promise<void>;
}
