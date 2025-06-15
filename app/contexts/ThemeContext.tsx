// contexts/ThemeContext.tsx
import * as SecureStore from "expo-secure-store"; // To persist theme preference
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

type ColorSchemeName = "light" | "dark" | null;

interface ThemeContextType {
  theme: ColorSchemeName;
  toggleTheme: () => void;
  setAppTheme: (newTheme: ColorSchemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme_preference";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(null); // null means system default initially

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const storedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (storedTheme === "light" || storedTheme === "dark") {
          setTheme(storedTheme);
        } else {
          // If no preference saved, use device's color scheme
          setTheme(deviceColorScheme ?? "light");
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
        setTheme(deviceColorScheme ?? "light");
      }
    };
    loadThemePreference();
  }, [deviceColorScheme]);

  const setAppTheme = async (newTheme: ColorSchemeName) => {
    try {
      setTheme(newTheme);
      if (newTheme) {
        await SecureStore.setItemAsync(THEME_STORAGE_KEY, newTheme);
      } else {
        await SecureStore.deleteItemAsync(THEME_STORAGE_KEY); // Remove preference to follow system
      }
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme =
      theme === "light"
        ? "dark"
        : theme === "dark"
        ? "light"
        : deviceColorScheme === "light"
        ? "dark"
        : "light"; // If currently null (system), toggle from system
    setAppTheme(newTheme);
  };

  // Provide the current theme (either user preference or device default) to consumers
  const currentTheme: ColorSchemeName =
    theme ||
    (deviceColorScheme === "light" || deviceColorScheme === "dark"
      ? deviceColorScheme
      : "light");

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, toggleTheme, setAppTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
