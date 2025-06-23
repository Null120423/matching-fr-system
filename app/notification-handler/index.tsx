import { useAuth } from "@/contexts/AuthContext";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import "react-native-gesture-handler";
import { registerForPushNotificationsAsync } from "./expoNotification.service";

function NotificationHandler({ children }: { children: React.ReactNode }) {
  const { onSetExpoToken } = useAuth();
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log("Expo Push Token:", token);
      return token && onSetExpoToken(token);
    });

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // todo handle notification response
        // const taskId = response?.notification?.request?.content?.data?.id;
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const { queryParams } = Linking.parse(url);
        console.log("Params from deep link:", queryParams);
      }
    };
    handleDeepLink();
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);
  return <Fragment>{children}</Fragment>;
}

export default NotificationHandler;
