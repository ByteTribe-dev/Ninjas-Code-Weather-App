import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface WeatherBackgroundProps {
  weatherType: string;
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherType,
  children,
}) => {
  const { isDark } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const particleAnim = new Animated.Value(0);

  useEffect(() => {
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
  }, [weatherType]);

  const getWeatherConfig = (type: string) => {
    const baseConfig = {
      Sunny: {
        light: ['#FFD700', '#FFA500', '#FF8C00'],
        dark: ['#B8860B', '#D2691E', '#CD853F'],
        particles: '☀️',
        particleCount: 3,
        particleColor: '#FFD700',
      },
      Clear: {
        light: ['#FFD700', '#FFA500', '#FF8C00'],
        dark: ['#B8860B', '#D2691E', '#CD853F'],
        particles: '☀️',
        particleCount: 3,
        particleColor: '#FFD700',
      },
      Cloudy: {
        light: ['#808080', '#A9A9A9', '#C0C0C0'],
        dark: ['#2F4F4F', '#696969', '#778899'],
        particles: '☁️',
        particleCount: 5,
        particleColor: '#FFFFFF',
      },
      Overcast: {
        light: ['#696969', '#808080', '#A9A9A9'],
        dark: ['#2F4F4F', '#696969', '#778899'],
        particles: '☁️',
        particleCount: 5,
        particleColor: '#FFFFFF',
      },
      'Partly Cloudy': {
        light: ['#A9A9A9', '#C0C0C0', '#D3D3D3'],
        dark: ['#696969', '#778899', '#B0C4DE'],
        particles: '⛅',
        particleCount: 2,
        particleColor: '#FFFFFF',
      },
      Rainy: {
        light: ['#4169E1', '#1E90FF', '#00BFFF'],
        dark: ['#191970', '#000080', '#0000CD'],
        particles: '🌧️',
        particleCount: 8,
        particleColor: '#87CEEB',
      },
      'Heavy Rain': {
        light: ['#1E90FF', '#4169E1', '#000080'],
        dark: ['#000080', '#191970', '#000033'],
        particles: '🌧️',
        particleCount: 8,
        particleColor: '#87CEEB',
      },
      'Light Rain': {
        light: ['#87CEEB', '#B0E0E6', '#E0F6FF'],
        dark: ['#4682B4', '#5F9EA0', '#B0E0E6'],
        particles: '🌦️',
        particleCount: 6,
        particleColor: '#B0E0E6',
      },
      Thunderstorm: {
        light: ['#483D8B', '#2F4F4F', '#191970'],
        dark: ['#191970', '#000033', '#000022'],
        particles: '⛈️',
        particleCount: 4,
        particleColor: '#FFD700',
      },
      Stormy: {
        light: ['#483D8B', '#2F4F4F', '#191970'],
        dark: ['#191970', '#000033', '#000022'],
        particles: '⛈️',
        particleCount: 4,
        particleColor: '#FFD700',
      },
      Humid: {
        light: ['#20B2AA', '#48D1CC', '#7FFFD4'],
        dark: ['#008B8B', '#20B2AA', '#48D1CC'],
        particles: '💧',
        particleCount: 7,
        particleColor: '#48D1CC',
      },
      Foggy: {
        light: ['#D3D3D3', '#F5F5F5', '#FFFFFF'],
        dark: ['#696969', '#778899', '#B0C4DE'],
        particles: '🌫️',
        particleCount: 4,
        particleColor: '#F5F5F5',
      },
      Misty: {
        light: ['#F0F8FF', '#E6E6FA', '#F8F8FF'],
        dark: ['#778899', '#B0C4DE', '#E6E6FA'],
        particles: '🌫️',
        particleCount: 4,
        particleColor: '#F5F5F5',
      },
      Snowy: {
        light: ['#F0F8FF', '#E6E6FA', '#F8F8FF'],
        dark: ['#778899', '#B0C4DE', '#E6E6FA'],
        particles: '❄️',
        particleCount: 10,
        particleColor: '#FFFFFF',
      },
      Windy: {
        light: ['#87CEEB', '#B0E0E6', '#E0F6FF'],
        dark: ['#4682B4', '#5F9EA0', '#B0E0E6'],
        particles: '💨',
        particleCount: 6,
        particleColor: '#B0E0E6',
      },
    };

    const config = baseConfig[type as keyof typeof baseConfig] || baseConfig.Windy;
    return {
      gradient: isDark ? config.dark : config.light,
      particles: config.particles,
      particleCount: config.particleCount,
      particleColor: config.particleColor,
    };
  };

  const config = getWeatherConfig(weatherType);

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      const translateY = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height],
      });

      const translateX = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.sin(i) * 100],
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
              left: (width / config.particleCount) * i,
              transform: [
                { translateY },
                { translateX },
                { scale },
              ],
              opacity,
            },
          ]}
        >
          <Ionicons 
            name={getParticleIcon(weatherType)} 
            size={24} 
            color={config.particleColor} 
          />
        </Animated.View>
      );
    }
    return particles;
  };

  const getParticleIcon = (type: string) => {
    switch (type) {
      case 'Sunny':
      case 'Clear':
        return 'sunny';
      case 'Rainy':
      case 'Heavy Rain':
      case 'Light Rain':
        return 'water';
      case 'Thunderstorm':
      case 'Stormy':
        return 'flash';
      case 'Snowy':
        return 'snow';
      case 'Windy':
        return 'leaf';
      default:
        return 'cloud';
    }
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
      <View style={styles.particlesContainer}>
        {renderParticles()}
      </View>

      {/* Weather overlay effects */}
      <Animated.View 
        style={[
          styles.weatherOverlay,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {weatherType === 'Rainy' || weatherType === 'Heavy Rain' || weatherType === 'Light Rain' ? (
          <View style={styles.rainContainer}>
            {[...Array(20)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.rainDrop,
                  {
                    left: (width / 20) * i,
                    animationDelay: `${i * 0.1}s`,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                  },
                ]}
              />
            ))}
          </View>
        ) : null}

        {weatherType === 'Snowy' ? (
          <View style={styles.snowContainer}>
            {[...Array(15)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.snowflake,
                  {
                    left: (width / 15) * i,
                    animationDelay: `${i * 0.2}s`,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  },
                ]}
              />
            ))}
          </View>
        ) : null}
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    top: height,
  },
  weatherOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    borderRadius: 1,
    top: -20,
  },
  snowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  snowflake: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: -6,
  },
  content: {
    flex: 1,
  },
});
