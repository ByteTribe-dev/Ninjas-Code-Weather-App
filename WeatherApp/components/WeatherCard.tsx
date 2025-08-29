import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
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
  getWeatherColor,
  getWeatherIcon,
  getWindDirection,
} from "../utils/weatherUtils";

interface WeatherCardProps {
  weatherData: WeatherData;
  onPress?: () => void;
  showFavoriteButton?: boolean;
}

const { width } = Dimensions.get("window");

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  onPress,
  showFavoriteButton = true,
}) => {
  const {
    temperatureUnit,
    addToFavorites,
    removeFromFavorites,
    favoriteCities,
  } = useWeather();

  const isFavorite = favoriteCities.some(
    (fav) => fav.city === weatherData.city
  );
  const temperature = convertTemperature(
    weatherData.temperature,
    temperatureUnit
  );
  const weatherIcon = getWeatherIcon(weatherData.weather);
  const weatherColor = getWeatherColor(weatherData.weather);
  const cardStyle = getWeatherCardStyle(weatherData.weather);

  // Get weather-specific styling
  const getWeatherStyle = () => {
    const weatherStyles: { [key: string]: any } = {
      Sunny: {
        gradient: ["#FFD700", "#FFA500", "#FF8C00"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        borderColor: "#FFD700",
      },
      Clear: {
        gradient: ["#FFD700", "#FFA500", "#FF8C00"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        borderColor: "#FFD700",
      },
      Cloudy: {
        gradient: ["#808080", "#A9A9A9", "#C0C0C0"],
        textColor: "#ffffff",
        subtextColor: "#cccccc",
        backgroundColor: "rgba(128, 128, 128, 0.1)",
        borderColor: "#808080",
      },
      Overcast: {
        gradient: ["#696969", "#808080", "#A9A9A9"],
        textColor: "#ffffff",
        subtextColor: "#cccccc",
        backgroundColor: "rgba(105, 105, 105, 0.1)",
        borderColor: "#696969",
      },
      "Partly Cloudy": {
        gradient: ["#A9A9A9", "#C0C0C0", "#D3D3D3"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(169, 169, 169, 0.1)",
        borderColor: "#A9A9A9",
      },
      Rainy: {
        gradient: ["#4169E1", "#1E90FF", "#00BFFF"],
        textColor: "#ffffff",
        subtextColor: "#cccccc",
        backgroundColor: "rgba(65, 105, 225, 0.1)",
        borderColor: "#4169E1",
      },
      "Light Rain": {
        gradient: ["#87CEEB", "#B0E0E6", "#E0F6FF"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(135, 206, 235, 0.1)",
        borderColor: "#87CEEB",
      },
      "Heavy Rain": {
        gradient: ["#1E90FF", "#4169E1", "#000080"],
        textColor: "#ffffff",
        subtextColor: "#cccccc",
        backgroundColor: "rgba(30, 144, 255, 0.1)",
        borderColor: "#1E90FF",
      },
      Thunderstorm: {
        gradient: ["#483D8B", "#2F4F4F", "#191970"],
        textColor: "#ffffff",
        subtextColor: "#cccccc",
        backgroundColor: "rgba(72, 61, 139, 0.1)",
        borderColor: "#483D8B",
      },
      Stormy: {
        gradient: ["#483D8B", "#2F4F4F", "#191970"],
        textColor: "#ffffff",
        subtextColor: "#cccccc",
        backgroundColor: "rgba(72, 61, 139, 0.1)",
        borderColor: "#483D8B",
      },
      Humid: {
        gradient: ["#20B2AA", "#48D1CC", "#7FFFD4"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(32, 178, 170, 0.1)",
        borderColor: "#20B2AA",
      },
      Foggy: {
        gradient: ["#D3D3D3", "#F5F5F5", "#FFFFFF"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(211, 211, 211, 0.1)",
        borderColor: "#D3D3D3",
      },
      Misty: {
        gradient: ["#F0F8FF", "#E6E6FA", "#F8F8FF"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(240, 248, 255, 0.1)",
        borderColor: "#F0F8FF",
      },
      Snowy: {
        gradient: ["#F0F8FF", "#E6E6FA", "#F8F8FF"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(240, 248, 255, 0.1)",
        borderColor: "#F0F8FF",
      },
      Windy: {
        gradient: ["#87CEEB", "#B0E0E6", "#E0F6FF"],
        textColor: "#333333",
        subtextColor: "#666666",
        backgroundColor: "rgba(135, 206, 235, 0.1)",
        borderColor: "#87CEEB",
      },
    };

    return weatherStyles[weatherData.weather] || weatherStyles["Clear"];
  };

  const weatherStyle = getWeatherStyle();

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
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

    // Pulse animation for temperature
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

    // Rotation animation for weather icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for the entire card
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

  const handleFavoritePress = () => {
    // Add a quick bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isFavorite) {
      removeFromFavorites(weatherData.city);
    } else {
      addToFavorites(weatherData);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
            {
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={weatherStyle.gradient as readonly [string, string, string]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: weatherStyle.backgroundColor,
            borderColor: weatherStyle.borderColor,
            borderWidth: 2,
            shadowColor: weatherStyle.borderColor,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowRadius: 16,
            elevation: 12,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.locationInfo}>
            <Text style={[styles.cityName, { color: weatherStyle.textColor }]}>
              {weatherData.city}
            </Text>
            <Text
              style={[styles.countryName, { color: weatherStyle.subtextColor }]}
            >
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
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transform: [{ scale: isFavorite ? 1.2 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={isFavorite ? "#FF6B6B" : weatherStyle.subtextColor}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.weatherInfo}>
          <View style={styles.temperatureSection}>
            <Animated.Text
              style={[
                styles.temperature,
                {
                  color: weatherStyle.textColor,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {temperature}°{temperatureUnit}
            </Animated.Text>
            <Animated.View
              style={[
                styles.weatherIconContainer,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: [
                    { scale: pulseAnim },
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.weatherIcon}>{weatherIcon}</Text>
            </Animated.View>
          </View>

          <Text
            style={[
              styles.weatherDescription,
              { color: weatherStyle.subtextColor },
            ]}
          >
            {weatherData.description}
          </Text>
        </View>

        <View
          style={[
            styles.detailsContainer,
            {
              borderTopColor: weatherStyle.borderColor,
            },
          ]}
        >
          <View style={styles.detailItem}>
            <View
              style={[
                styles.detailIconContainer,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              ]}
            >
              <Ionicons
                name="water-outline"
                size={18}
                color={weatherStyle.subtextColor}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text
                style={[styles.detailValue, { color: weatherStyle.textColor }]}
              >
                {weatherData.humidity}%
              </Text>
              <Text
                style={[
                  styles.detailLabel,
                  { color: weatherStyle.subtextColor },
                ]}
              >
                {getHumidityLevel(weatherData.humidity)}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View
              style={[
                styles.detailIconContainer,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              ]}
            >
              <Ionicons
                name="leaf-outline"
                size={18}
                color={weatherStyle.subtextColor}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text
                style={[styles.detailValue, { color: weatherStyle.textColor }]}
              >
                {weatherData.windSpeed} km/h
              </Text>
              <Text
                style={[
                  styles.detailLabel,
                  { color: weatherStyle.subtextColor },
                ]}
              >
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
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  container: {
    borderRadius: 24,
    padding: 28,
    minHeight: 200,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  locationInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  countryName: {
    fontSize: 18,
    fontWeight: "500",
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  weatherInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  temperatureSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    marginRight: 20,
  },
  weatherIconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  weatherIcon: {
    fontSize: 44,
  },
  weatherDescription: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailIconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  detailTextContainer: {
    alignItems: "flex-start",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
