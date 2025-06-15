import { IMG } from "@/assets/images";
import { Title } from "@/components/@core";
import { ButtonOutlined, ButtonPrimary } from "@/components/@core/button";
import Row from "@/components/@core/row";
import Separator from "@/components/@core/separator";
import { styleGlobal } from "@/components/@core/styles";
import TextDefault from "@/components/@core/text-default";
import { normalize } from "@/helper/helpers";
import { deviceWidth } from "@/helper/utils";
import DefaultLayout from "@/layouts/default-layout";
import { SignedOut, useUser } from "@clerk/clerk-expo";
import { useClerk } from "@clerk/clerk-react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  return (
    <DefaultLayout imgBackground={IMG.introBg}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <Row
          rowGap={10}
          direction="column"
          full
          center
          style={styles.headerSection}
        >
          <Title color="black" bold>
            Find Your Best Matches
          </Title>
          <TextDefault center color="black">
            Enjoy together, happy to share and save your time connecting with
            people.
          </TextDefault>

          <Separator height={20} />

          <Image
            source={IMG.introIcon}
            style={{
              width: normalize(deviceWidth * 0.65),
              height: normalize(deviceWidth * 0.65),
              resizeMode: "contain",
            }}
          />
        </Row>
        <View style={styles.container}>
          {/* <SignedIn>
          <Row full direction="column" start rowGap={10}>
            <Title color="black" bold>
              Find Your Best Matches
            </Title>
            <TextDefault color="black">
              Enjoy together, happy to share and save your time connecting with
              people.
            </TextDefault>
          </Row>
        </SignedIn> */}

          <SignedOut>
            <Row
              full
              direction="column"
              center
              rowGap={10}
              style={{ marginTop: "auto" }}
            >
              <ButtonOutlined
                minWidth={deviceWidth - 30}
                height={normalize(50)}
                title="Sign up"
                onPress={() => router.navigate("/(auth)/sign-up")}
              />
              <ButtonPrimary
                minWidth={deviceWidth - 30}
                height={normalize(50)}
                title="Sign in"
                onPress={() => router.navigate("/(auth)/sign-in")}
              />
            </Row>
          </SignedOut>
        </View>
      </SafeAreaView>
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingTop: normalize(20),
    paddingBottom: normalize(10),
    paddingHorizontal: normalize(20),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    ...styleGlobal.shadow,
    alignItems: "center",
    justifyContent: "center",
    padding: normalize(20),
    borderTopEndRadius: normalize(20),
    borderTopStartRadius: normalize(20),
    backgroundColor: "#FEFEFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: normalize(40),
  },
});
