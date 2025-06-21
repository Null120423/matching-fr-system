import { useAuth } from "@/contexts/AuthContext";
import { Redirect, Slot, Stack } from "expo-router";
import React from "react";

export default function AuthRoutesLayout() {
  // const { isSignedIn } = useAuth();
  const { currentUser } = useAuth();

  // if (isSignedIn) {
  //   return <Redirect href={"/"} />;
  // }

  if (currentUser) {
    return <Redirect href={"/"} />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Slot />
    </Stack>
  );
}
