import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

interface WeatherBackgroundProps {
  weatherType: string;
  children: React.ReactNode;
}

const { width, height } = Dimensions.get("window");

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherType,
  children,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Pre-create all animation refs at the top level
  const particleRefs = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(0))
  ).current;
  const rainRefs = useRef(
    Array.from({ length: 25 }, () => new Animated.Value(0))
  ).current;
  const snowRefs = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0))
  ).current;
  const lightningRef = useRef(new Animated.Value(0)).current;
  const sunRayRefs = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;
  const windRefs = useRef(
    Array.from({ length: 6 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Reset animations when weather type changes
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    particleAnim.setValue(0);

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle animation
    Animated.loop(
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [weatherType, fadeAnim, scaleAnim, particleAnim]);

  // Start particle animations
  useEffect(() => {
    const config = getWeatherConfig(weatherType);
    particleRefs.slice(0, config.particleCount).forEach((animValue, i) => {
      const delay = i * 500;
      setTimeout(() => {
        Animated.loop(
          Animated.timing(animValue, {
            toValue: 1,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          })
        ).start();
      }, delay);
    });
  }, [weatherType, particleRefs]);

  // Start rain animations
  useEffect(() => {
    if (
      weatherType === "Rainy" ||
      weatherType === "Heavy Rain" ||
      weatherType === "Light Rain"
    ) {
      rainRefs.forEach((animValue, i) => {
        setTimeout(() => {
          Animated.loop(
            Animated.timing(animValue, {
              toValue: 1,
              duration: 1000 + Math.random() * 500,
              useNativeDriver: true,
            })
          ).start();
        }, Math.random() * 2000);
      });
    }
  }, [weatherType, rainRefs]);

  // Start snow animations
  useEffect(() => {
    if (weatherType === "Snowy") {
      snowRefs.forEach((animValue, i) => {
        setTimeout(() => {
          Animated.loop(
            Animated.timing(animValue, {
              toValue: 1,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            })
          ).start();
        }, Math.random() * 3000);
      });
    }
  }, [weatherType, snowRefs]);

  // Start lightning animations
  useEffect(() => {
    if (weatherType === "Thunderstorm" || weatherType === "Stormy") {
      const createLightning = () => {
        Animated.sequence([
          Animated.timing(lightningRef, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(lightningRef, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(lightningRef, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(lightningRef, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(createLightning, 3000 + Math.random() * 5000);
        });
      };
      setTimeout(createLightning, 2000);
    }
  }, [weatherType, lightningRef]);

  // Start sun ray animations
  useEffect(() => {
    if (weatherType === "Sunny" || weatherType === "Clear") {
      sunRayRefs.forEach((animValue) => {
        Animated.loop(
          Animated.timing(animValue, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          })
        ).start();
      });
    }
  }, [weatherType, sunRayRefs]);

  // Start wind animations
  useEffect(() => {
    if (weatherType === "Windy") {
      windRefs.forEach((animValue, i) => {
        setTimeout(() => {
          Animated.loop(
            Animated.timing(animValue, {
              toValue: 1,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            })
          ).start();
        }, i * 300);
      });
    }
  }, [weatherType, windRefs]);

  const getWeatherConfig = (type: string) => {
    switch (type) {
      case "Sunny":
      case "Clear":
        return {
          gradient: ["#FFD700", "#FFA500", "#FF8C00"] as const,
          particles: "☀️",
          particleCount: 3,
          particleColor: "#FFD700",
        };
      case "Cloudy":
      case "Overcast":
        return {
          gradient: ["#808080", "#A9A9A9", "#C0C0C0"] as const,
          particles: "☁️",
          particleCount: 5,
          particleColor: "#FFFFFF",
        };
      case "Partly Cloudy":
        return {
          gradient: ["#A9A9A9", "#C0C0C0", "#D3D3D3"] as const,
          particles: "⛅",
          particleCount: 2,
          particleColor: "#FFFFFF",
        };
      case "Rainy":
      case "Heavy Rain":
        return {
          gradient: ["#4169E1", "#1E90FF", "#00BFFF"] as const,
          particles: "🌧️",
          particleCount: 8,
          particleColor: "#87CEEB",
        };
      case "Light Rain":
        return {
          gradient: ["#87CEEB", "#B0E0E6", "#E0F6FF"] as const,
          particles: "🌦️",
          particleCount: 6,
          particleColor: "#B0E0E6",
        };
      case "Thunderstorm":
      case "Stormy":
        return {
          gradient: ["#483D8B", "#2F4F4F", "#191970"] as const,
          particles: "⛈️",
          particleCount: 4,
          particleColor: "#FFD700",
        };
      case "Humid":
        return {
          gradient: ["#20B2AA", "#48D1CC", "#7FFFD4"] as const,
          particles: "💧",
          particleCount: 7,
          particleColor: "#48D1CC",
        };
      case "Foggy":
      case "Misty":
        return {
          gradient: ["#D3D3D3", "#F5F5F5", "#FFFFFF"] as const,
          particles: "🌫️",
          particleCount: 4,
          particleColor: "#F5F5F5",
        };
      case "Snowy":
        return {
          gradient: ["#F0F8FF", "#E6E6FA", "#F8F8FF"] as const,
          particles: "❄️",
          particleCount: 10,
          particleColor: "#FFFFFF",
        };
      case "Windy":
        return {
          gradient: ["#87CEEB", "#B0E0E6", "#E0F6FF"] as const,
          particles: "💨",
          particleCount: 6,
          particleColor: "#B0E0E6",
        };
      default:
        return {
          gradient: ["#87CEEB", "#B0E0E6", "#E0F6FF"] as const,
          particles: "🌤️",
          particleCount: 3,
          particleColor: "#B0E0E6",
        };
    }
  };

  const config = getWeatherConfig(weatherType);

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      const particleAnimValue = particleRefs[i];

      const translateY = particleAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [height + 50, -100],
      });

      const translateX = particleAnimValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, Math.sin(i * 2) * 50, Math.sin(i * 3) * 30],
      });

      const opacity = particleAnimValue.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [0, 1, 1, 0],
      });

      const scale = particleAnimValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1.2, 0.8],
      });

      const rotation = particleAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      });

      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left:
                (width / (config.particleCount + 1)) * (i + 1) +
                Math.random() * 50 -
                25,
              transform: [
                { translateY },
                { translateX },
                { scale },
                { rotate: rotation },
              ],
              opacity,
            },
          ]}
        >
          <Text style={[styles.particleEmoji, { color: config.particleColor }]}>
            {config.particles}
          </Text>
        </Animated.View>
      );
    }
    return particles;
  };

  const renderWeatherEffects = () => {
    switch (weatherType) {
      case "Rainy":
      case "Heavy Rain":
      case "Light Rain":
        return renderRainEffect();
      case "Snowy":
        return renderSnowEffect();
      case "Thunderstorm":
      case "Stormy":
        return renderThunderstormEffect();
      case "Sunny":
      case "Clear":
        return renderSunnyEffect();
      case "Windy":
        return renderWindyEffect();
      default:
        return null;
    }
  };

  const renderRainEffect = () => {
    const rainDrops = [];
    for (let i = 0; i < 25; i++) {
      const rainAnim = rainRefs[i];

      const translateY = rainAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, height + 30],
      });

      rainDrops.push(
        <Animated.View
          key={i}
          style={[
            styles.rainDrop,
            {
              left: Math.random() * width,
              transform: [{ translateY }],
            },
          ]}
        />
      );
    }
    return <View style={styles.rainContainer}>{rainDrops}</View>;
  };

  const renderSnowEffect = () => {
    const snowflakes = [];
    for (let i = 0; i < 20; i++) {
      const snowAnim = snowRefs[i];

      const translateY = snowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, height + 20],
      });

      const translateX = snowAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, Math.sin(i) * 30, Math.sin(i * 2) * 20],
      });

      snowflakes.push(
        <Animated.View
          key={i}
          style={[
            styles.snowflake,
            {
              left: Math.random() * width,
              transform: [{ translateY }, { translateX }],
            },
          ]}
        />
      );
    }
    return <View style={styles.snowContainer}>{snowflakes}</View>;
  };

  const renderThunderstormEffect = () => {
    return (
      <Animated.View
        style={[
          styles.lightning,
          {
            opacity: lightningRef,
          },
        ]}
      />
    );
  };

  const renderSunnyEffect = () => {
    const sunRays = [];
    for (let i = 0; i < 8; i++) {
      const rayAnim = sunRayRefs[i];

      const rotation = rayAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [`${i * 45}deg`, `${i * 45 + 360}deg`],
      });

      const opacity = rayAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.8, 0.3],
      });

      sunRays.push(
        <Animated.View
          key={i}
          style={[
            styles.sunRay,
            {
              transform: [{ rotate: rotation }],
              opacity,
            },
          ]}
        />
      );
    }
    return <View style={styles.sunContainer}>{sunRays}</View>;
  };

  const renderWindyEffect = () => {
    const windLines = [];
    for (let i = 0; i < 6; i++) {
      const windAnim = windRefs[i];

      const translateX = windAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width * 1.5],
      });

      windLines.push(
        <Animated.View
          key={i}
          style={[
            styles.windLine,
            {
              top: 100 + i * 80,
              transform: [{ translateX }],
            },
          ]}
        />
      );
    }
    return <View style={styles.windContainer}>{windLines}</View>;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={config.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated particles */}
      <View style={styles.particlesContainer}>{renderParticles()}</View>

      {/* Enhanced Weather overlay effects */}
      <Animated.View
        style={[
          styles.weatherOverlay,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {renderWeatherEffects()}
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
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
    top: height,
  },
  weatherOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rainContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rainDrop: {
    position: "absolute",
    width: 2,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 1,
    top: -20,
  },
  snowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  snowflake: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 3,
    top: -6,
  },
  content: {
    flex: 1,
  },
  particleEmoji: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lightning: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  sunContainer: {
    position: "absolute",
    top: 100,
    left: width / 2 - 50,
    width: 100,
    height: 100,
  },
  sunRay: {
    position: "absolute",
    top: 45,
    left: 48,
    width: 4,
    height: 30,
    backgroundColor: "rgba(255, 215, 0, 0.6)",
    borderRadius: 2,
    transformOrigin: "2px 5px",
  },
  windContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  windLine: {
    position: "absolute",
    width: 60,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 1,
  },
});
