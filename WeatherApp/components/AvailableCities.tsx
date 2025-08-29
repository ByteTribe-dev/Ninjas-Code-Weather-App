import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface AvailableCitiesProps {
  onCityPress: (cityName: string) => void;
}

const availableCities = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Sydney",
  "Dubai",
  "Mumbai",
  "Singapore",
  "Toronto",
  "Berlin",
];

export const AvailableCities: React.FC<AvailableCitiesProps> = ({
  onCityPress,
}) => {
  const { isDark } = useTheme();

  const getContainerColors = () => {
    return isDark
      ? ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
      : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"];
  };

  const getButtonColors = () => {
    return isDark
      ? ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
      : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"];
  };

  const getTextColor = () => {
    return isDark ? "#ffffff" : "#333333";
  };

  const getButtonTextColor = () => {
    return isDark ? "#007AFF" : "#007AFF";
  };

  const getBorderColor = () => {
    return isDark ? "rgba(0, 122, 255, 0.3)" : "rgba(0, 122, 255, 0.2)";
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getContainerColors()}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Text style={[styles.title, { color: getTextColor() }]}>
        Popular Cities
      </Text>

      <View style={styles.citiesContainer}>
        {availableCities.map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.cityButton}
            onPress={() => onCityPress(city)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={getButtonColors()}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={[styles.cityText, { color: getButtonTextColor() }]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  citiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  cityButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
  },
  buttonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cityText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
