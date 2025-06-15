import { useAuth } from "@clerk/clerk-expo";
import { Slot, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  // if (isSignedIn) {
  //   return <Redirect href={"/"} />;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Slot />
    </Stack>
  );
}
