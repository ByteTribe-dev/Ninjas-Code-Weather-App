import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: "#333333" }]}>
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
              colors={[
                "rgba(255, 255, 255, 0.95)",
                "rgba(255, 255, 255, 0.85)",
              ]}
              style={styles.itemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.searchInfo}>
              <Text style={[styles.cityName, { color: "#333333" }]}>
                {item.city}
              </Text>
              <Text style={[styles.countryName, { color: "#666666" }]}>
                {item.country}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
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
