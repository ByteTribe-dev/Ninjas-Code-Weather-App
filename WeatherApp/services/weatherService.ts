import {
  WEATHER_CONFIG,
  getWeatherIcon,
  mapWeatherCondition,
} from "../config/weather";
import { WeatherData } from "../types/weather";

/**
 * WeatherService Class
 *
 * Provides methods to fetch weather data from various APIs:
 * - WeatherAPI.com (primary)
 * - OpenWeatherMap (alternative)
 * - Mock data generator (for testing)
 *
 * All methods return standardized WeatherData objects
 */
export class WeatherService {
  /**
   * Get weather data using WeatherAPI.com based on coordinates
   *
   * @param latitude - Geographic latitude
   * @param longitude - Geographic longitude
   * @returns Promise<WeatherData | null> - Weather data or null if failed
   */
  static async getWeatherByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    try {
      const { WEATHER_API } = WEATHER_CONFIG;
      const url = `${WEATHER_API.BASE_URL}${WEATHER_API.ENDPOINTS.CURRENT}?key=${WEATHER_API.API_KEY}&q=${latitude},${longitude}&aqi=no`;

      console.log(
        "Fetching real weather data from:",
        url.replace(WEATHER_API.API_KEY, "API_KEY_HIDDEN")
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Weather API responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Weather API response:", data);

      // Convert API response to our WeatherData format
      const weatherData: WeatherData = {
        id: Date.now(),
        city: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        weather: mapWeatherCondition(data.current.condition.text),
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph * 0.277778), // Convert km/h to m/s
        description: data.current.condition.text,
        icon: getWeatherIcon(data.current.condition.text),
        coordinates: {
          lat: data.location.lat,
          lng: data.location.lon,
        },
      };

      return weatherData;
    } catch (error) {
      console.error("WeatherAPI.com failed:", error);
      return null;
    }
  }

  /**
   * Alternative weather data source using OpenWeatherMap API
   *
   * @param latitude - Geographic latitude
   * @param longitude - Geographic longitude
   * @returns Promise<WeatherData | null> - Weather data or null if failed
   */
  static async getWeatherByCoordinatesOpenWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    try {
      const { OPENWEATHER_API } = WEATHER_CONFIG;
      const url = `${OPENWEATHER_API.BASE_URL}${OPENWEATHER_API.ENDPOINTS.CURRENT}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API.API_KEY}&units=metric`;

      console.log("Fetching weather from OpenWeatherMap...");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `OpenWeatherMap API responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("OpenWeatherMap response:", data);

      // Convert API response to our WeatherData format
      const weatherData: WeatherData = {
        id: Date.now(),
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        weather: mapWeatherCondition(data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        coordinates: {
          lat: data.coord.lat,
          lng: data.coord.lon,
        },
      };

      return weatherData;
    } catch (error) {
      console.error("OpenWeatherMap failed:", error);
      return null;
    }
  }

  /**
   * Get weather data by city name using WeatherAPI.com
   *
   * @param cityName - Name of the city to search for
   * @returns Promise<WeatherData | null> - Weather data or null if failed
   */
  static async getWeatherByCity(cityName: string): Promise<WeatherData | null> {
    try {
      const { WEATHER_API } = WEATHER_CONFIG;
      const url = `${WEATHER_API.BASE_URL}${
        WEATHER_API.ENDPOINTS.CURRENT
      }?key=${WEATHER_API.API_KEY}&q=${encodeURIComponent(cityName)}&aqi=no`;

      console.log("Fetching weather for city:", cityName);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Weather API responded with status: ${response.status}`
        );
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        id: Date.now(),
        city: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_c),
        weather: mapWeatherCondition(data.current.condition.text),
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph * 0.277778),
        description: data.current.condition.text,
        icon: getWeatherIcon(data.current.condition.text),
        coordinates: {
          lat: data.location.lat,
          lng: data.location.lon,
        },
      };

      return weatherData;
    } catch (error) {
      console.error("Weather API city search failed:", error);
      return null;
    }
  }

  /**
   * Generate mock weather data for testing without API keys
   * Simulates realistic weather based on geographic location
   *
   * @param latitude - Geographic latitude
   * @param longitude - Geographic longitude
   * @returns Promise<WeatherData> - Always returns weather data (never null)
   */
  static async getMockRealWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData> {
    // Simulate API delay for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    /**
     * Generate location-appropriate weather data
     * Uses coordinate ranges to determine realistic weather patterns
     */
    const getLocationBasedWeather = (lat: number, lng: number) => {
      // Pakistan region - optimized for local weather patterns
      if (lat >= 24 && lat <= 37 && lng >= 61 && lng <= 75) {
        return {
          city: lat > 33 ? "Islamabad" : lat > 31 ? "Lahore" : "Karachi",
          country: "Pakistan",
          temperature: Math.round(20 + Math.random() * 15), // 20-35°C typical range
          weather: ["Sunny", "Partly Cloudy", "Clear"][
            Math.floor(Math.random() * 3)
          ],
          humidity: Math.round(40 + Math.random() * 30), // 40-70% humidity range
        };
      }

      // Default fallback for other regions
      return {
        city: "Current Location",
        country: "Unknown",
        temperature: Math.round(15 + Math.random() * 20), // 15-35°C general range
        weather: "Partly Cloudy",
        humidity: 60,
      };
    };

    const locationWeather = getLocationBasedWeather(latitude, longitude);

    return {
      id: Date.now(),
      city: locationWeather.city,
      country: locationWeather.country,
      temperature: locationWeather.temperature,
      weather: locationWeather.weather,
      humidity: locationWeather.humidity,
      windSpeed: Math.round(5 + Math.random() * 15), // 5-20 m/s wind range
      description: `Current weather conditions in ${locationWeather.city}`,
      icon: getWeatherIcon(locationWeather.weather),
      coordinates: { lat: latitude, lng: longitude },
    };
  }
}
