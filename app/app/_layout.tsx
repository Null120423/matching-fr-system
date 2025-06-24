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
import { AuthContextProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"; // Import your ThemeProvider and useTheme hook
import { ToastProvider } from "@/contexts/ToastContext";
import NotificationHandler from "@/notification-handler";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      // schedulePushNotification();
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
          <InitialLayout />
        </ClerkLoaded>
      </ClerkProvider>
      {/* Set StatusBar style based on theme */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}
function InitialLayout() {
  return (
    <Stack>
      {/* Cấu hình animation cho từng màn hình */}
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(home)"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(common)/appointments/detail"
        options={{
          headerTitle: "My Appointments",
          headerShown: true,
          animation: "slide_from_right",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/appointments/index"
        options={{
          headerTitle: "My Appointments Detail",
          headerShown: true,
          animation: "slide_from_right",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(home)/notification"
        options={{
          headerTitle: "My Notifications",
          headerShown: true,
          animation: "slide_from_right",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/notification/detail"
        options={{
          headerTitle: "My Notifications",
          headerShown: true,
          animation: "slide_from_right",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/profile/edit"
        options={{
          headerTitle: "Update Profile",
          headerShown: true,
          animation: "slide_from_right",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/setting/index"
        options={{
          headerTitle: "Settings",
          headerShown: true,
          animation: "slide_from_right",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/fr-requests/index"
        options={{
          // headerTitle: "Friend Requests",
          headerShown: false,
          animation: "slide_from_right",
          // headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/user-profile/index"
        options={{
          // headerTitle: "Friend Requests",
          headerShown: false,
          animation: "slide_from_right",
          // headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/current-friends/index"
        options={{
          headerTitle: "Your Friends",
          headerShown: true,
          animation: "slide_from_right",
          // headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="(common)/current-friends/appointments/index"
        options={{
          headerTitle: "Your Appointments",
          headerShown: true,
          animation: "slide_from_right",
          // headerBackTitle: "Back",
        }}
      />
      <Stack.Screen name="+not-found" options={{ animation: "fade" }} />
    </Stack>
  );
}
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <BottomSheetModalProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <AuthContextProvider>
                <NotificationHandler>
                  <RootLayoutContent />
                </NotificationHandler>
              </AuthContextProvider>
            </QueryClientProvider>
          </ToastProvider>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
