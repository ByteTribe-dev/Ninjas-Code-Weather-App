import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWeather } from "../context/WeatherContext";
import { WeatherData } from "../types/weather";
import {
  convertTemperature,
  getHumidityLevel,
  getWeatherCardStyle,
  getWeatherIcon,
  getWeatherTextColor,
  getWindDirection,
} from "../utils/weatherUtils";

/**
 * Props interface for the WeatherCard component
 */
interface WeatherCardProps {
  /** Weather data to display in the card */
  weatherData: WeatherData;
  /** Whether to show the favorite button (default: true) */
  showFavoriteButton?: boolean;
}

/**
 * WeatherCard Component
 *
 * A beautifully animated weather card that displays:
 * - City name and country
 * - Current temperature with unit conversion
 * - Weather condition with animated icon
 * - Humidity and wind speed details
 * - Favorite toggle functionality
 * - Dynamic gradient backgrounds based on weather
 * - Smooth entry and continuous animations
 */
export const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  showFavoriteButton = true,
}) => {
  // Weather context for temperature unit and favorites
  const {
    temperatureUnit,
    addToFavorites,
    removeFromFavorites,
    favoriteCities,
  } = useWeather();

  // Computed values based on weather data and user preferences
  const isFavorite = favoriteCities.some(
    (fav) => fav.city === weatherData.city
  );
  const temperature = convertTemperature(
    weatherData.temperature,
    temperatureUnit
  );
  const weatherIcon = getWeatherIcon(weatherData.weather);
  const cardStyle = getWeatherCardStyle(weatherData.weather);
  const textColor = getWeatherTextColor(weatherData.weather);

  // Animation references for smooth UI interactions
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Entry scale animation
  const fadeAnim = useRef(new Animated.Value(0)).current; // Entry fade animation
  const slideAnim = useRef(new Animated.Value(50)).current; // Entry slide animation
  const pulseAnim = useRef(new Animated.Value(1)).current; // Continuous pulse animation
  const rotateAnim = useRef(new Animated.Value(0)).current; // Icon rotation animation
  const floatAnim = useRef(new Animated.Value(0)).current; // Floating particle animation

  /**
   * Initialize animations when component mounts or weather data changes
   */
  useEffect(() => {
    // Entry animation sequence - scale up, fade in, slide up
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for temperature
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slow rotation animation for weather icons (sun, wind, etc.)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    // Floating animation for particles and weather icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [weatherData]);

  /**
   * Handle favorite button press
   * Toggles the city in/out of favorites list
   */
  const handleFavoritePress = () => {
    if (isFavorite) {
      removeFromFavorites(weatherData.city);
    } else {
      addToFavorites(weatherData);
    }
  };

  /**
   * Get rotation style for weather icons
   * Only certain weather types (Sunny, Clear, Windy) get rotation animation
   */
  const getRotationStyle = () => {
    const rotation = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    // Only rotate for certain weather types that benefit from rotation
    const rotatingWeathers = ["Sunny", "Clear", "Windy"];
    if (rotatingWeathers.includes(weatherData.weather)) {
      return { transform: [{ rotate: rotation }] };
    }
    return {};
  };

  /**
   * Get floating animation style
   * Creates a subtle up-down floating motion
   */
  const getFloatingStyle = () => {
    const translateY = floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10],
    });

    return { transform: [{ translateY }] };
  };

  /**
   * Render floating weather particles for visual enhancement
   * Creates 3 floating weather icons with staggered animation
   */
  const renderFloatingParticles = () => {
    const particles = [];

    for (let i = 0; i < 3; i++) {
      const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10 - i * 5], // Staggered floating heights
      });

      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.floatingParticle,
            {
              left: 20 + i * 30, // Spread particles horizontally
              opacity: 0.3,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.particleText}>
            {getWeatherIcon(weatherData.weather)}
          </Text>
        </Animated.View>
      );
    }

    return particles;
  };

  /**
   * Get gradient colors based on weather condition
   * Returns appropriate color scheme for each weather type
   */
  const getGradientColors = () => {
    const weatherGradients: {
      [key: string]: readonly [string, string, string];
    } = {
      Sunny: ["#FFD700", "#FFA500", "#FF8C00"] as const,
      Clear: ["#FFD700", "#FFA500", "#FF8C00"] as const,
      Cloudy: ["#708090", "#778899", "#B0C4DE"] as const,
      Overcast: ["#696969", "#808080", "#A9A9A9"] as const,
      "Partly Cloudy": ["#87CEEB", "#B0C4DE", "#E6E6FA"] as const,
      Rainy: ["#4682B4", "#5F9EA0", "#87CEEB"] as const,
      "Light Rain": ["#87CEEB", "#B0E0E6", "#E0F6FF"] as const,
      "Heavy Rain": ["#1E90FF", "#4169E1", "#0000CD"] as const,
      Thunderstorm: ["#483D8B", "#6A5ACD", "#9370DB"] as const,
      Stormy: ["#2F4F4F", "#483D8B", "#191970"] as const,
      Humid: ["#20B2AA", "#48D1CC", "#7FFFD4"] as const,
      Foggy: ["#D3D3D3", "#F5F5F5", "#FFFFFF"] as const,
      Misty: ["#F0F8FF", "#E6E6FA", "#F8F8FF"] as const,
      Snowy: ["#F0F8FF", "#E6E6FA", "#FFFFFF"] as const,
      Windy: ["#87CEEB", "#B0E0E6", "#E0F6FF"] as const,
    };

    return (
      weatherGradients[weatherData.weather] ||
      (["#87CEEB", "#B0E0E6", "#E0F6FF"] as const)
    );
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      {/* Dynamic gradient background based on weather */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.container, cardStyle]}>
        {/* Floating weather particles for visual enhancement */}
        {renderFloatingParticles()}

        {/* Header with location and favorite button */}
        <View style={styles.header}>
          <View style={styles.locationInfo}>
            <Text style={[styles.cityName, { color: textColor }]}>
              {weatherData.city}
            </Text>
            <Text style={[styles.countryName, { color: textColor + "CC" }]}>
              {weatherData.country}
            </Text>
          </View>
          {showFavoriteButton && (
            <TouchableOpacity
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
            >
              <Animated.View
                style={[
                  styles.favoriteIconContainer,
                  {
                    transform: [{ scale: isFavorite ? 1.2 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorite ? "#FF6B6B" : textColor + "CC"}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>

        {/* Main weather information */}
        <View style={styles.weatherInfo}>
          <View style={styles.temperatureSection}>
            {/* Animated temperature display */}
            <Animated.Text
              style={[
                styles.temperature,
                {
                  color: textColor,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {temperature}°{temperatureUnit}
            </Animated.Text>
            {/* Animated weather icon with multiple effects */}
            <Animated.View
              style={[
                styles.weatherIconContainer,
                getFloatingStyle(),
                {
                  transform: [
                    { scale: pulseAnim },
                    ...getFloatingStyle().transform,
                    ...(getRotationStyle().transform || []),
                  ],
                },
              ]}
            >
              <Text style={styles.weatherIcon}>{weatherIcon}</Text>
            </Animated.View>
          </View>

          {/* Weather description */}
          <Text
            style={[styles.weatherDescription, { color: textColor + "CC" }]}
          >
            {weatherData.description}
          </Text>
        </View>

        {/* Weather details section */}
        <View style={styles.detailsContainer}>
          {/* Humidity information */}
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Ionicons
                name="water-outline"
                size={18}
                color={textColor + "CC"}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailValue, { color: textColor }]}>
                {weatherData.humidity}%
              </Text>
              <Text style={[styles.detailLabel, { color: textColor + "CC" }]}>
                {getHumidityLevel(weatherData.humidity)}
              </Text>
            </View>
          </View>

          {/* Wind speed information */}
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Ionicons
                name="leaf-outline"
                size={18}
                color={textColor + "CC"}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={[styles.detailValue, { color: textColor }]}>
                {weatherData.windSpeed} km/h
              </Text>
              <Text style={[styles.detailLabel, { color: textColor + "CC" }]}>
                {getWindDirection(weatherData.windSpeed)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Main card container with margins
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  // Dynamic gradient background
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  // Main card content container
  container: {
    borderRadius: 24,
    padding: 28,
    minHeight: 200,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  // Header section with location and favorite button
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  // Location information container
  locationInfo: {
    flex: 1,
  },
  // City name styling
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  // Country name styling
  countryName: {
    fontSize: 18,
    fontWeight: "500",
  },
  // Favorite button container
  favoriteButton: {
    padding: 8,
  },
  // Favorite icon container with background
  favoriteIconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  // Weather information section
  weatherInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  // Temperature and icon section
  temperatureSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  // Temperature text styling
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    marginRight: 20,
  },
  // Weather icon container
  weatherIconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  // Weather icon text styling
  weatherIcon: {
    fontSize: 44,
  },
  // Weather description text
  weatherDescription: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  // Details section container
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  // Individual detail item
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // Detail icon container
  detailIconContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  // Detail text container
  detailTextContainer: {
    alignItems: "flex-start",
  },
  // Detail value text (humidity %, wind speed)
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Detail label text (description)
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Floating particle positioning
  floatingParticle: {
    position: "absolute",
    top: 20,
    zIndex: 1,
  },
  // Floating particle text styling
  particleText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
