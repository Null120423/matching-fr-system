import DashboardView from "@/views/dashboard-view";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useCallback } from "react";

function Page() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
    }
  }, [signOut]);

  const logExternalAccounts = useCallback(() => {
    return user?.externalAccounts?.[0] as any;
  }, [user]);
  return <DashboardView />;
}

export default Page;
