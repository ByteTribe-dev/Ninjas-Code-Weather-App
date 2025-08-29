import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AvailableCities } from "@/components/AvailableCities";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchBar } from "@/components/SearchBar";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherLoader } from "@/components/WeatherLoader";
import { useWeather } from "@/context/WeatherContext";

export default function HomeScreen() {
  const {
    currentWeather,
    isLoading,
    searchWeather,
    recentSearches,
    clearRecentSearches,
  } = useWeather();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (currentWeather) {
      searchWeather(currentWeather.city);
    }
    setTimeout(() => setRefreshing(false), 1000);
  }, [currentWeather, searchWeather]);

  const handleSearch = (city: string) => {
    searchWeather(city);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#f8f9fa", "#e9ecef", "#dee2e6"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Weather App</Text>
          <Text style={styles.subtitle}>Get real-time weather updates</Text>
        </View>

        <SearchBar onSearch={handleSearch} />

        <TemperatureToggle />

        {isLoading && !currentWeather ? (
          <WeatherLoader />
        ) : currentWeather ? (
          <WeatherCard weatherData={currentWeather} showFavoriteButton={true} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Welcome to Weather App!</Text>
            <Text style={styles.emptyStateSubtitle}>
              Search for a city to get started
            </Text>
          </View>
        )}

        {recentSearches.length > 0 && (
          <RecentSearches
            recentSearches={recentSearches}
            onSearchPress={handleSearch}
            onClearAll={clearRecentSearches}
          />
        )}

        <AvailableCities onCityPress={handleSearch} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
});
