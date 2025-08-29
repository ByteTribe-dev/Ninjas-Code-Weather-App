import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  FavoriteCity,
  RecentSearch,
  TemperatureUnit,
  WeatherContextType,
  WeatherData,
} from "../types/weather";

interface WeatherState {
  currentWeather: WeatherData | null;
  recentSearches: RecentSearch[];
  favoriteCities: FavoriteCity[];
  temperatureUnit: TemperatureUnit;
  isLoading: boolean;
  error: string | null;
}

type WeatherAction =
  | { type: "SET_CURRENT_WEATHER"; payload: WeatherData }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_RECENT_SEARCH"; payload: RecentSearch }
  | { type: "CLEAR_RECENT_SEARCHES" }
  | { type: "ADD_FAVORITE"; payload: FavoriteCity }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "TOGGLE_TEMPERATURE_UNIT" }
  | {
      type: "LOAD_STORED_DATA";
      payload: {
        recentSearches: RecentSearch[];
        favoriteCities: FavoriteCity[];
        temperatureUnit: TemperatureUnit;
      };
    };

const initialState: WeatherState = {
  currentWeather: null,
  recentSearches: [],
  favoriteCities: [],
  temperatureUnit: "C",
  isLoading: false,
  error: null,
};

const weatherReducer = (
  state: WeatherState,
  action: WeatherAction
): WeatherState => {
  switch (action.type) {
    case "SET_CURRENT_WEATHER":
      return { ...state, currentWeather: action.payload, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "ADD_RECENT_SEARCH":
      const updatedRecentSearches = [
        action.payload,
        ...state.recentSearches.filter(
          (search) => search.city !== action.payload.city
        ),
      ].slice(0, 10);
      return { ...state, recentSearches: updatedRecentSearches };
    case "CLEAR_RECENT_SEARCHES":
      return { ...state, recentSearches: [] };
    case "ADD_FAVORITE":
      const updatedFavorites = [
        action.payload,
        ...state.favoriteCities.filter(
          (fav) => fav.city !== action.payload.city
        ),
      ];
      return { ...state, favoriteCities: updatedFavorites };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favoriteCities: state.favoriteCities.filter(
          (fav) => fav.city !== action.payload
        ),
      };
    case "TOGGLE_TEMPERATURE_UNIT":
      return {
        ...state,
        temperatureUnit: state.temperatureUnit === "C" ? "F" : "C",
      };
    case "LOAD_STORED_DATA":
      return {
        ...state,
        recentSearches: action.payload.recentSearches,
        favoriteCities: action.payload.favoriteCities,
        temperatureUnit: action.payload.temperatureUnit,
      };
    default:
      return state;
  }
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Load stored data on app start
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [recentSearches, favoriteCities, temperatureUnit] =
        await Promise.all([
          AsyncStorage.getItem("recentSearches"),
          AsyncStorage.getItem("favoriteCities"),
          AsyncStorage.getItem("temperatureUnit"),
        ]);

      dispatch({
        type: "LOAD_STORED_DATA",
        payload: {
          recentSearches: recentSearches ? JSON.parse(recentSearches) : [],
          favoriteCities: favoriteCities ? JSON.parse(favoriteCities) : [],
          temperatureUnit: temperatureUnit ? JSON.parse(temperatureUnit) : "C",
        },
      });
    } catch (error) {
      console.error("Error loading stored data:", error);
    }
  };

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(
      "recentSearches",
      JSON.stringify(state.recentSearches)
    );
  }, [state.recentSearches]);

  useEffect(() => {
    AsyncStorage.setItem(
      "favoriteCities",
      JSON.stringify(state.favoriteCities)
    );
  }, [state.favoriteCities]);

  useEffect(() => {
    AsyncStorage.setItem(
      "temperatureUnit",
      JSON.stringify(state.temperatureUnit)
    );
  }, [state.temperatureUnit]);

  const searchWeather = async (cityName: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      // Get all weather data from JSON server
      const response = await fetch("http://localhost:3001/");
      const html = await response.text();

      // Extract all available IDs from the HTML response
      const idMatches = html.match(/href="(\d+)"/g);
      if (!idMatches) {
        dispatch({ type: "SET_ERROR", payload: "No weather data available" });
        return;
      }

      // Extract IDs and fetch each weather record
      const ids = idMatches
        .map((match) => {
          const matchResult = match.match(/\d+/);
          return matchResult ? matchResult[0] : null;
        })
        .filter((id) => id !== null) as string[];
      const weatherPromises = ids.map((id) =>
        fetch(`http://localhost:3001/${id}`).then((res) => res.json())
      );

      const weatherData: WeatherData[] = await Promise.all(weatherPromises);

      const cityWeather = weatherData.find(
        (city) => city.city.toLowerCase() === cityName.toLowerCase()
      );

      if (cityWeather) {
        dispatch({ type: "SET_CURRENT_WEATHER", payload: cityWeather });
        dispatch({
          type: "ADD_RECENT_SEARCH",
          payload: {
            city: cityWeather.city,
            country: cityWeather.country,
            timestamp: Date.now(),
          },
        });
      } else {
        dispatch({ type: "SET_ERROR", payload: "City not found" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch weather data" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToFavorites = (weatherData: WeatherData) => {
    const favoriteCity: FavoriteCity = {
      city: weatherData.city,
      country: weatherData.country,
      weatherData,
      addedAt: Date.now(),
    };
    dispatch({ type: "ADD_FAVORITE", payload: favoriteCity });
  };

  const removeFromFavorites = (cityName: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: cityName });
  };

  const toggleTemperatureUnit = () => {
    dispatch({ type: "TOGGLE_TEMPERATURE_UNIT" });
  };

  const clearRecentSearches = () => {
    dispatch({ type: "CLEAR_RECENT_SEARCHES" });
  };

  const getCurrentLocation = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        dispatch({ type: "SET_ERROR", payload: "Location permission denied" });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Find the closest city from our data
      const response = await fetch("http://localhost:3001/");
      const html = await response.text();

      // Extract all available IDs from the HTML response
      const idMatches = html.match(/href="(\d+)"/g);
      if (!idMatches) {
        dispatch({ type: "SET_ERROR", payload: "No weather data available" });
        return;
      }

      // Extract IDs and fetch each weather record
      const ids = idMatches
        .map((match) => {
          const matchResult = match.match(/\d+/);
          return matchResult ? matchResult[0] : null;
        })
        .filter((id) => id !== null) as string[];

      const weatherPromises = ids.map((id) =>
        fetch(`http://localhost:3001/${id}`).then((res) => res.json())
      );

      const weatherData: WeatherData[] = await Promise.all(weatherPromises);

      // Simple distance calculation (you could use a more sophisticated algorithm)
      const closestCity = weatherData.reduce(
        (closest, city) => {
          const distance = Math.sqrt(
            Math.pow(city.coordinates.lat - latitude, 2) +
              Math.pow(city.coordinates.lng - longitude, 2)
          );
          return distance < closest.distance ? { city, distance } : closest;
        },
        { city: weatherData[0], distance: Infinity }
      );

      dispatch({ type: "SET_CURRENT_WEATHER", payload: closestCity.city });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to get current location",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value: WeatherContextType = {
    ...state,
    searchWeather,
    addToFavorites,
    removeFromFavorites,
    toggleTemperatureUnit,
    clearRecentSearches,
    getCurrentLocation,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
