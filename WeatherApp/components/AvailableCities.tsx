import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AvailableCitiesProps {
  onCityPress: (cityName: string) => void;
}

const availableCities = [
  { name: "New York", emoji: "🗽", gradient: ["#FF6B6B", "#FF8E53"] as const },
  { name: "London", emoji: "🏰", gradient: ["#4ECDC4", "#44A08D"] as const },
  { name: "Tokyo", emoji: "🗼", gradient: ["#FA709A", "#FEE140"] as const },
  { name: "Paris", emoji: "🗼", gradient: ["#A8EDEA", "#FED6E3"] as const },
  { name: "Sydney", emoji: "🏖️", gradient: ["#FFE259", "#FFA751"] as const },
  { name: "Dubai", emoji: "🏜️", gradient: ["#667eea", "#764ba2"] as const },
  { name: "Mumbai", emoji: "🏙️", gradient: ["#f093fb", "#f5576c"] as const },
  { name: "Singapore", emoji: "🌆", gradient: ["#4facfe", "#00f2fe"] as const },
  { name: "Toronto", emoji: "🍁", gradient: ["#43e97b", "#38f9d7"] as const },
  { name: "Berlin", emoji: "🏛️", gradient: ["#fa709a", "#fee140"] as const },
];

export const AvailableCities: React.FC<AvailableCitiesProps> = ({
  onCityPress,
}) => {
  const CityButton = ({
    city,
    index,
  }: {
    city: (typeof availableCities)[0];
    index: number;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [index, opacityAnim]);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.cityButtonContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cityButton}
          onPress={() => onCityPress(city.name)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={city.gradient}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.cityContent}>
            <Text style={styles.cityEmoji}>{city.emoji}</Text>
            <Text style={styles.cityText}>{city.name}</Text>
          </View>
          <View style={styles.shimmerOverlay} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          [
            "rgba(255, 255, 255, 0.98)",
            "rgba(248, 250, 252, 0.95)",
            "rgba(241, 245, 249, 0.92)",
          ] as const
        }
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>✈️ Popular Destinations</Text>
        <Text style={styles.subtitle}>Discover weather around the world</Text>
      </View>

      <View style={styles.citiesContainer}>
        {availableCities.map((city, index) => (
          <CityButton key={city.name} city={city} index={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a202c",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },
  citiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  cityButtonContainer: {
    marginBottom: 8,
  },
  cityButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minWidth: 100,
  },
  buttonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cityContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  cityEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
  },
});
