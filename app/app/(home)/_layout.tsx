import DiscoverIcon from "@/assets/svg/discover-icon";
import HomeIcon from "@/assets/svg/home-icon";
import NotificationIcon from "@/assets/svg/notification-icon";
import PersonIcon from "@/assets/svg/person-icon";
import Loading from "@/components/@core/loading";
import { Colors } from "@/constants/Colors"; // Import Colors
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { normalize } from "@/helper/helpers";
import DefaultLayout from "@/layouts/default-layout";
import { useUser } from "@clerk/clerk-react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"; // Add StyleSheet, Platform

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme(); // Get theme from context
  const currentColors = Colors[theme || "light"]; // Get current theme colors

  const MAPIcon = useMemo(() => {
    return {
      index: (
        <HomeIcon
          color={
            state.index === 0
              ? currentColors.tabIconSelected
              : currentColors.tabIconDefault
          }
        />
      ),
      discover: (
        <DiscoverIcon
          color={
            state.index === 1
              ? currentColors.tabIconSelected
              : currentColors.tabIconDefault
          }
        />
      ),
      notification: (
        <NotificationIcon
          color={
            state.index === 2
              ? currentColors.tabIconSelected
              : currentColors.tabIconDefault
          }
        />
      ),
      profile: (
        <PersonIcon
          color={
            state.index === 3
              ? currentColors.tabIconSelected
              : currentColors.tabIconDefault
          }
        />
      ),
    };
  }, [state.index, currentColors]); // Re-memoize when state.index or currentColors changes

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: currentColors.tabBackground, // Themed background
          shadowColor: currentColors.text, // Themed shadow color
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabBarButton,
              {
                backgroundColor: isFocused
                  ? currentColors.tabSelectedBackground // Themed selected background
                  : "transparent",
              },
            ]}
          >
            {/* Directly use the mapped icon from MAPIcon */}
            {MAPIcon[route.name as keyof typeof MAPIcon]}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Layout() {
  const { user, isLoaded } = useUser();
  const { theme } = useTheme(); // Get theme from context

  if (!isLoaded) {
    return (
      <DefaultLayout>
        <Loading />
      </DefaultLayout>
    );
  }

  // if (!user) {
  //   return <Redirect href="/(auth)/intro" />;
  // }

  return (
    <DefaultLayout>
      {/* Set StatusBar style based on current theme */}
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
        })}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="discover" options={{ title: "Discover" }} />
        <Tabs.Screen name="notification" options={{ title: "Notification" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: normalize(60),
    position: "absolute",
    bottom: Platform.OS === "ios" ? normalize(20) : normalize(10), // Adjusted for iOS/Android
    right: normalize(20),
    left: normalize(20),
    borderRadius: normalize(100),
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabBarButton: {
    alignItems: "center",
    justifyContent: "center",
    height: normalize(40),
    width: normalize(40),
    borderRadius: normalize(100),
  },
});
