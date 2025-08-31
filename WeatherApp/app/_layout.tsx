import { WeatherProvider } from "@/context/WeatherContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WeatherProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </WeatherProvider>
  );
}
