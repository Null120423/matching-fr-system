// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native"; // Renamed to avoid conflict
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { tokenCache } from "@/cache";
import { Colors } from "@/constants/Colors"; // Import your centralized Colors
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"; // Import your ThemeProvider and useTheme hook
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  const { theme } = useTheme(); // Use your custom theme hook
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const navigationTheme =
    theme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: Colors.dark.primary, // Primary color for dark theme
            background: Colors.dark.background,
            card: Colors.dark.backgroundCard,
            text: Colors.dark.text,
            border: Colors.dark.border,
            notification: Colors.dark.secondary,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.primary, // Primary color for light theme
            background: Colors.light.background,
            card: Colors.light.backgroundCard,
            text: Colors.light.text,
            border: Colors.light.border,
            notification: Colors.light.secondary,
          },
        };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <Slot />
        </ClerkLoaded>
      </ClerkProvider>
      {/* Set StatusBar style based on theme */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
