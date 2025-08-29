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

export const TemperatureToggle: React.FC = () => {
  const { temperatureUnit, toggleTemperatureUnit } = useWeather();

  const slideAnim = useRef(
    new Animated.Value(temperatureUnit === "C" ? 0 : 1)
  ).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    // Slide animation
    Animated.spring(slideAnim, {
      toValue: temperatureUnit === "C" ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Scale animation
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

    toggleTemperatureUnit();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 52], // Adjust based on your toggle width
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.7)"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Temperature Unit</Text>

        <TouchableOpacity
          style={styles.toggle}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.toggleBackground,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["#007AFF", "#0056CC"]}
              style={styles.toggleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            <Animated.View
              style={[
                styles.slider,
                {
                  transform: [{ translateX }],
                },
              ]}
            >
              <LinearGradient
                colors={["#ffffff", "#f8f9fa"]}
                style={styles.sliderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>

            <View style={styles.labelsContainer}>
              <Text
                style={[
                  styles.unitLabel,
                  temperatureUnit === "C" && styles.activeLabel,
                ]}
              >
                °C
              </Text>
              <Text
                style={[
                  styles.unitLabel,
                  temperatureUnit === "F" && styles.activeLabel,
                ]}
              >
                °F
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  toggle: {
    width: 100,
    height: 40,
  },
  toggleBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  slider: {
    position: "absolute",
    top: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    height: "100%",
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeLabel: {
    color: "#007AFF",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
