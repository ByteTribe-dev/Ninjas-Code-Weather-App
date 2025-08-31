import { AvailableCities } from "@/components/AvailableCities";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchBar } from "@/components/SearchBar";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { WeatherBackground } from "@/components/WeatherBackground";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherLoader } from "@/components/WeatherLoader";
import { useWeather } from "@/context/WeatherContext";
import { getWeatherColor, getWeatherIcon } from "@/utils/weatherUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const {
    currentWeather,
    recentSearches,
    isLoading,
    error,
    searchWeather,
    clearRecentSearches,
    getCurrentLocation,
  } = useWeather();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  useEffect(() => {
    console.log("HomeScreen mounted - iOS optimized version");
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleRefresh = async () => {
    if (currentWeather) {
      await searchWeather(currentWeather.city);
    } else {
      await getCurrentLocation();
    }
  };

  const getWeatherGradient = () => {
    if (!currentWeather) {
      return ["#87CEEB", "#B0E0E6", "#E0F6FF"] as const;
    }

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
      weatherGradients[currentWeather.weather] ||
      (["#87CEEB", "#B0E0E6", "#E0F6FF"] as const)
    );
  };

  const getTextColor = () => {
    if (!currentWeather) return "#333";
    const lightWeathers = ["Sunny", "Clear", "Foggy", "Misty", "Snowy"];
    return lightWeathers.includes(currentWeather.weather) ? "#333" : "#fff";
  };

  const renderAnimatedHeader = () => {
    return (
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={getWeatherGradient()}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.headerContent}>
          <Animated.View style={styles.weatherIconContainer}>
            <Text style={styles.headerWeatherIcon}>
              {currentWeather ? getWeatherIcon(currentWeather.weather) : "🌤️"}
            </Text>
          </Animated.View>

          <View style={styles.headerTextContainer}>
            <Animated.Text
              style={[
                styles.headerTitle,
                { color: getTextColor(), opacity: fadeAnim },
              ]}
            >
              {currentWeather ? currentWeather.city : "Weather"}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.headerSubtitle,
                { color: getTextColor() + "CC", opacity: fadeAnim },
              ]}
            >
              {currentWeather
                ? `${currentWeather.description} • ${currentWeather.country}`
                : "Your personal weather companion"}
            </Animated.Text>
          </View>

          {currentWeather && (
            <Animated.View
              style={[
                styles.temperatureDisplay,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={[styles.temperatureText, { color: getTextColor() }]}>
                {Math.round(currentWeather.temperature)}°
              </Text>
            </Animated.View>
          )}
        </View>

        {renderFloatingElements()}
      </Animated.View>
    );
  };

  const renderFloatingElements = () => {
    return null;
  };

  if (isLoading && !currentWeather) {
    return <WeatherLoader />;
  }

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {renderAnimatedHeader()}

      <Animated.ScrollView
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={
              currentWeather
                ? getWeatherColor(currentWeather.weather)
                : "#007AFF"
            }
            colors={[
              currentWeather
                ? getWeatherColor(currentWeather.weather)
                : "#007AFF",
            ]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.controlsContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <SearchBar onSearch={searchWeather} />
          <TemperatureToggle />
        </Animated.View>

        {currentWeather && (
          <Animated.View
            style={[
              styles.currentWeatherContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <WeatherCard
              weatherData={currentWeather}
              showFavoriteButton={true}
            />
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.sectionsContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {!currentWeather && recentSearches.length === 0 && (
            <View style={styles.emptyState}>
              <Animated.View
                style={[
                  styles.emptyStateContent,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name="partly-sunny-outline"
                    size={80}
                    color="#87CEEB"
                  />
                </View>
                <Text style={styles.emptyStateTitle}>
                  Welcome to Weather App
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  Search for a city to get started or use your current location
                </Text>
              </Animated.View>
            </View>
          )}

          <RecentSearches
            recentSearches={recentSearches}
            onSearchPress={searchWeather}
            onClearAll={clearRecentSearches}
          />

          <Animated.View
            style={[
              styles.availableCitiesContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <AvailableCities onCityPress={searchWeather} />
          </Animated.View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        style={
          currentWeather &&
          ["Sunny", "Clear", "Foggy", "Misty", "Snowy"].includes(
            currentWeather.weather
          )
            ? "dark"
            : "light"
        }
      />

      {currentWeather ? (
        <WeatherBackground weatherType={currentWeather.weather}>
          {renderContent()}
        </WeatherBackground>
      ) : (
        <LinearGradient
          colors={["#87CEEB", "#B0E0E6", "#E0F6FF"]}
          style={styles.defaultBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  defaultBackground: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  animatedHeader: {
    height: 180,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
  },
  weatherIconContainer: {
    marginRight: 20,
    padding: 12,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerWeatherIcon: {
    fontSize: 50,
    textAlign: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  temperatureDisplay: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  temperatureText: {
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  floatingElement: {
    position: "absolute",
    zIndex: 1,
  },
  floatingElementText: {
    fontSize: 20,
    opacity: 0.6,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  controlsContainer: {
    marginBottom: 20,
  },
  currentWeatherContainer: {
    marginBottom: 20,
  },
  sectionsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 50,
  },
  emptyStateContent: {
    alignItems: "center",
    marginBottom: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  availableCitiesContainer: {
    width: "100%",
  },
});
