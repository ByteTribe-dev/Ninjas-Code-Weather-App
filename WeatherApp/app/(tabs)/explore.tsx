import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useWeather } from "@/context/WeatherContext";

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIconContainer}>
      <Ionicons name={icon as any} size={24} color="#007AFF" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingSubtitle}>{subtitle}</Text>
    </View>
    {showArrow && <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { temperatureUnit, toggleTemperatureUnit, clearRecentSearches } =
    useWeather();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClearRecentSearches = () => {
    Alert.alert(
      "Clear Recent Searches",
      "Are you sure you want to clear all recent searches?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearRecentSearches,
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Weather App",
      "A beautiful weather app with dynamic backgrounds and animations based on weather conditions.\n\nVersion 1.0.0",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#f8f9fa", "#e9ecef", "#dee2e6"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              Customize your weather experience
            </Text>
          </View>

          {/* Temperature Unit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temperature</Text>
            <View style={styles.card}>
              <SettingItem
                icon="thermometer"
                title="Temperature Unit"
                subtitle={`Currently set to °${temperatureUnit}`}
                onPress={toggleTemperatureUnit}
              />
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            <View style={styles.card}>
              <SettingItem
                icon="trash-outline"
                title="Clear Recent Searches"
                subtitle="Remove all recent search history"
                onPress={handleClearRecentSearches}
              />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <SettingItem
                icon="information-circle-outline"
                title="About Weather App"
                subtitle="Version 1.0.0"
                onPress={handleAbout}
              />
            </View>
          </View>

          {/* Weather Features Info */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Weather Features</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>☀️</Text>
                <Text style={styles.featureText}>Sunny = Yellow</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>☁️</Text>
                <Text style={styles.featureText}>Cloudy = Gray</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌧️</Text>
                <Text style={styles.featureText}>Rainy = Blue</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>❄️</Text>
                <Text style={styles.featureText}>Snowy = White</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⛈️</Text>
                <Text style={styles.featureText}>Storm = Purple</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💨</Text>
                <Text style={styles.featureText}>Windy = Sky Blue</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
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
  content: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  featuresSection: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
  },
});
