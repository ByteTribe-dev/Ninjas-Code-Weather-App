import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWeather } from "../context/WeatherContext";

/**
 * TemperatureToggle Component
 *
 * An animated toggle switch that allows users to switch between
 * Celsius and Fahrenheit temperature units. Features:
 * - Smooth scale and glow animations on press
 * - Visual feedback with gradient backgrounds
 * - Persistent user preference storage
 * - Immediate temperature conversion throughout the app
 */
export const TemperatureToggle: React.FC = () => {
  const { temperatureUnit, toggleTemperatureUnit } = useWeather();

  // Animation references for interactive feedback
  const scaleAnim = useRef(new Animated.Value(1)).current; // Scale animation on press
  const glowAnim = useRef(new Animated.Value(0)).current; // Glow effect animation

  /**
   * Handle toggle press with animations
   * Provides visual feedback through scale and glow effects
   * Then toggles the temperature unit in the context
   */
  const handleToggle = () => {
    // Scale animation - press down then spring back
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow effect - fade in then fade out
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    // Toggle the temperature unit
    toggleTemperatureUnit();
  };

  // Interpolate glow opacity for smooth animation
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
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

      {/* Glow effect on interaction */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowOpacity,
          },
        ]}
      />

      {/* Label */}
      <Text style={styles.label}>Temperature Unit</Text>

      {/* Toggle buttons container */}
      <View style={styles.toggleContainer}>
        {/* Celsius button */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            temperatureUnit === "C" && styles.activeButton,
          ]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          {/* Active state gradient background */}
          {temperatureUnit === "C" && (
            <LinearGradient
              colors={["#007AFF", "#0056CC"]}
              style={styles.activeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <Text
            style={[
              styles.toggleText,
              temperatureUnit === "C" && styles.activeText,
            ]}
          >
            °C
          </Text>
        </TouchableOpacity>

        {/* Fahrenheit button */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            temperatureUnit === "F" && styles.activeButton,
          ]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          {/* Active state gradient background */}
          {temperatureUnit === "F" && (
            <LinearGradient
              colors={["#007AFF", "#0056CC"]}
              style={styles.activeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <Text
            style={[
              styles.toggleText,
              temperatureUnit === "F" && styles.activeText,
            ]}
          >
            °F
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Main container with gradient background and animations
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    overflow: "hidden",
  },
  // Background gradient layer
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Glow effect layer for interactions
  glowEffect: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    backgroundColor: "#007AFF",
  },
  // Label text styling
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // Container for toggle buttons
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 16,
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  // Individual toggle button styling
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
    zIndex: 1,
    overflow: "hidden",
  },
  // Active button state (empty - styling handled by gradient)
  activeButton: {},
  // Gradient background for active button
  activeButtonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  // Default toggle button text
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    zIndex: 1,
  },
  // Active toggle button text
  activeText: {
    color: "#fff",
    fontWeight: "700",
    zIndex: 1,
  },
});
