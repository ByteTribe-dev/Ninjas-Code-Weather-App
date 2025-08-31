import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export const WeatherLoader: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animation
    Animated.loop(
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const translateY = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height * 0.3],
      });

      const translateX = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.sin(i) * 50],
      });

      const opacity = particleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0],
      });

      const scale = particleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 1, 0.5],
      });

      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: (width / 6) * i,
              transform: [{ translateY }, { translateX }, { scale }],
              opacity,
            },
          ]}
        >
          <Ionicons name="cloud" size={20} color="#87CEEB" />
        </Animated.View>
      );
    }
    return particles;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#87CEEB", "#B0E0E6", "#E0F6FF"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated particles */}
      <View style={styles.particlesContainer}>{renderParticles()}</View>

      {/* Main loader */}
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.loaderCircle,
            {
              transform: [{ rotate }, { scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["#007AFF", "#0056CC", "#003399"]}
            style={styles.loaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Ionicons name="partly-sunny" size={40} color="#FFD700" />
        </Animated.View>
      </View>

      {/* Loading text */}
      <Animated.Text
        style={[
          styles.loadingText,
          {
            opacity: pulseAnim,
          },
        ]}
      >
        Loading weather data...
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: "absolute",
    top: height * 0.7,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loaderCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  loaderGradient: {
    flex: 1,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 30,
    textAlign: "center",
  },
});
