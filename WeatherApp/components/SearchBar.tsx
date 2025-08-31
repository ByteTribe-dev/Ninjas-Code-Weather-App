import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useWeather } from "../context/WeatherContext";

/**
 * Props interface for the SearchBar component
 */
interface SearchBarProps {
  /** Callback function called when user searches for a city */
  onSearch: (cityName: string) => void;
  /** Optional placeholder text for the search input */
  placeholder?: string;
}

/**
 * SearchBar Component
 *
 * An animated search bar with location button that allows users to:
 * - Search for cities by typing
 * - Get weather for current location
 * - Features smooth animations and visual feedback
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search for a city...",
}) => {
  // State management
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { getCurrentLocationWithRealAPI } = useWeather();

  // Animation references for smooth UI interactions
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // Scale animation for focus
  const glowAnim = useRef(new Animated.Value(0)).current; // Glow effect when focused
  const shakeAnim = useRef(new Animated.Value(0)).current; // Shake animation for empty search

  /**
   * Handle focus/blur animations
   * Scales up and adds glow effect when focused, reverses when blurred
   */
  useEffect(() => {
    if (isFocused) {
      // Focus animations: scale up and show glow
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.02,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Blur animations: scale back and hide glow
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isFocused]);

  /**
   * Handle search submission
   * If text exists, trigger search and clear input
   * If empty, show shake animation as feedback
   */
  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText.trim());
      setSearchText("");
    } else {
      // Shake animation for empty search - provides visual feedback
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  /**
   * Handle location button press
   * Triggers current location weather fetch using real API
   */
  const handleLocationPress = () => {
    console.log(
      "Location icon pressed - getting real weather for current location"
    );
    if (getCurrentLocationWithRealAPI) {
      getCurrentLocationWithRealAPI();
    } else {
      console.log("Real weather API not available");
    }
  };

  // Interpolate glow opacity based on focus state
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={styles.container}>
      {/* Main search input container with animations */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
          },
        ]}
      >
        {/* Background gradient */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Glow effect when focused */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Search input content */}
        <View style={styles.searchContent}>
          <Ionicons
            name="search"
            size={22}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            autoCapitalize="words"
          />
          {/* Clear button - only shown when text exists */}
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Location button for current location weather */}
      <TouchableOpacity
        onPress={handleLocationPress}
        style={styles.locationButton}
      >
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
          style={styles.locationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Ionicons name="location" size={22} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container holding search bar and location button
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  // Search input container with animations
  searchContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  // Background gradient for search container
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Glow effect shown when search is focused
  glowEffect: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    backgroundColor: "#007AFF",
  },
  // Content container for search elements
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  // Search icon styling
  searchIcon: {
    marginRight: 12,
  },
  // Text input styling
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 4,
  },
  // Clear button styling
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Location button styling
  locationButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  // Location button gradient background
  locationGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
