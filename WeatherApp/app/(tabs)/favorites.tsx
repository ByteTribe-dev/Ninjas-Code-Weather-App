import { WeatherCard } from "@/components/WeatherCard";
import { useTheme } from "@/context/ThemeContext";
import { useWeather } from "@/context/WeatherContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { favoriteCities } = useWeather();
  const { isDark } = useTheme();

  const getBackgroundColors = () => {
    return isDark
      ? ["#1a1a1a", "#2d2d2d", "#404040"]
      : ["#f8f9fa", "#e9ecef", "#dee2e6"];
  };

  const getTextColor = () => {
    return isDark ? "#ffffff" : "#333333";
  };

  const getSubtextColor = () => {
    return isDark ? "#cccccc" : "#666666";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <LinearGradient
          colors={getBackgroundColors()}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: getTextColor() }]}>
              Favorite Cities
            </Text>
            <Text style={[styles.subtitle, { color: getSubtextColor() }]}>
              {favoriteCities.length === 0
                ? "No favorite cities yet"
                : `${favoriteCities.length} favorite cit${
                    favoriteCities.length === 1 ? "y" : "ies"
                  }`}
            </Text>
          </View>

          {favoriteCities.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="heart-outline"
                  size={64}
                  color={getSubtextColor()}
                />
              </View>
              <Text style={[styles.emptyTitle, { color: getTextColor() }]}>
                No Favorites Yet
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: getSubtextColor() }]}
              >
                Add cities to your favorites to see them here
              </Text>
            </View>
          ) : (
            <View style={styles.favoritesList}>
              {favoriteCities.map((city) => (
                <WeatherCard
                  key={`${city.city}-${city.country}`}
                  weatherData={city}
                  showFavoriteButton={true}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
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
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  favoritesList: {
    paddingHorizontal: 16,
  },
});
