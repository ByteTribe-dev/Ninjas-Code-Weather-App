/**
 * Weather API Configuration
 *
 * Contains configuration for multiple weather API providers:
 * - WeatherAPI.com: Primary API with generous free tier
 * - OpenWeatherMap: Alternative API for fallback
 *
 * Free tier limits:
 * - WeatherAPI.com: 1M calls/month
 * - OpenWeatherMap: 1000 calls/day
 */
export const WEATHER_CONFIG = {
  // Primary weather API - WeatherAPI.com
  WEATHER_API: {
    BASE_URL: "http://api.weatherapi.com/v1",
    API_KEY: "ce5a5cf227f24ce5977151451253108", // Get free API key from weatherapi.com
    ENDPOINTS: {
      CURRENT: "/current.json",
      FORECAST: "/forecast.json",
    },
  },

  // Alternative weather API - OpenWeatherMap
  OPENWEATHER_API: {
    BASE_URL: "http://api.openweathermap.org/data/2.5",
    API_KEY: "your-openweather-api-key", // Get free API key from openweathermap.org
    ENDPOINTS: {
      CURRENT: "/weather",
      FORECAST: "/forecast",
    },
  },
};

/**
 * Map external API weather conditions to standardized app weather types
 *
 * Takes various weather condition strings from different APIs and
 * normalizes them to consistent weather types used throughout the app
 *
 * @param condition - Weather condition string from API
 * @returns Standardized weather type string
 */
export const mapWeatherCondition = (condition: string): string => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return "Sunny";
  }
  if (
    conditionLower.includes("partly cloudy") ||
    conditionLower.includes("partly sunny")
  ) {
    return "Partly Cloudy";
  }
  if (
    conditionLower.includes("cloudy") ||
    conditionLower.includes("overcast")
  ) {
    return "Cloudy";
  }
  if (conditionLower.includes("rain") && conditionLower.includes("heavy")) {
    return "Heavy Rain";
  }
  if (conditionLower.includes("rain") && conditionLower.includes("light")) {
    return "Light Rain";
  }
  if (conditionLower.includes("rain")) {
    return "Rainy";
  }
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return "Thunderstorm";
  }
  if (conditionLower.includes("snow")) {
    return "Snowy";
  }
  if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return "Foggy";
  }
  if (conditionLower.includes("wind")) {
    return "Windy";
  }

  return "Partly Cloudy"; // Default fallback
};

/**
 * Get appropriate weather icon identifier based on condition
 *
 * Maps weather conditions to icon identifiers used by the app
 * Icons are typically emoji or icon font identifiers
 *
 * @param condition - Weather condition string
 * @returns Icon identifier string
 */
export const getWeatherIcon = (condition: string): string => {
  const mappedCondition = mapWeatherCondition(condition);

  const iconMap: { [key: string]: string } = {
    Sunny: "sunny",
    Clear: "clear",
    "Partly Cloudy": "partly-cloudy",
    Cloudy: "cloudy",
    Overcast: "overcast",
    Rainy: "rainy",
    "Light Rain": "light-rain",
    "Heavy Rain": "heavy-rain",
    Thunderstorm: "thunderstorm",
    Snowy: "snowy",
    Foggy: "foggy",
    Misty: "misty",
    Windy: "windy",
    Humid: "humid",
  };

  return iconMap[mappedCondition] || "partly-cloudy";
};
