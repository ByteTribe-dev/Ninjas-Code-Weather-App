import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { RecentSearch } from "../types/weather";

interface RecentSearchesProps {
  recentSearches: RecentSearch[];
  onSearchPress: (cityName: string) => void;
  onClearAll: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onSearchPress,
  onClearAll,
}) => {
  const { isDark } = useTheme();

  if (recentSearches.length === 0) {
    return null;
  }

  const getContainerColors = () => {
    return isDark
      ? ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
      : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"];
  };

  const getItemColors = () => {
    return isDark
      ? ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
      : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"];
  };

  const getTextColor = () => {
    return isDark ? "#ffffff" : "#333333";
  };

  const getSubtextColor = () => {
    return isDark ? "#cccccc" : "#666666";
  };

  const getIconColor = () => {
    return isDark ? "#cccccc" : "#666666";
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getContainerColors()}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: getTextColor() }]}>
          Recent Searches
        </Text>
        <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {recentSearches.map((item) => (
          <TouchableOpacity
            key={`${item.city}-${item.timestamp}`}
            style={styles.searchItem}
            onPress={() => onSearchPress(item.city)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={getItemColors()}
              style={styles.itemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.searchInfo}>
              <Text style={[styles.cityName, { color: getTextColor() }]}>
                {item.city}
              </Text>
              <Text style={[styles.countryName, { color: getSubtextColor() }]}>
                {item.country}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={getIconColor()} />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
  },
});
