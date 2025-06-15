import { IMG } from "@/assets/images";
import { Input, InputPassword } from "@/components/@core";
import { ButtonPrimary, IconButton } from "@/components/@core/button";
import Row from "@/components/@core/row";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { normalize } from "@/helper/helpers";
import DefaultLayout from "@/layouts/default-layout";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../header";
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
const Login = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startOAuthFlowWithDiscord } = useOAuth({
    strategy: "oauth_discord",
  });
  const { startOAuthFlow: startOAuthFlowWithGithub } = useOAuth({
    strategy: "oauth_github",
  });

  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    router.push("/(home)");
    // if (!isLoaded) {
    //   return;
    // }
    // setLoading(true);
    // try {
    //   const completeSignIn = await signIn.create({
    //     identifier: emailAddress,
    //     password,
    //   });

    //   // This indicates the user is signed in
    //   await setActive({ session: completeSignIn.createdSessionId });
    // } catch (err: any) {
    //   alert(err.errors[0].message);
    // } finally {
    //   setLoading(false);
    // }
  };
  const onLoginWithGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const onLoginWithGoogleWithDiscord = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlowWithDiscord({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const onLoginWithGoogleWithGithub = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlowWithGithub({
          redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);
  return (
    <DefaultLayout imgBackground={IMG.signInBg}>
      <Header title="Sign In" />
      <View style={styles.container}>
        <TextDefault size={normalize(22)} bold>
          Welcome Back
        </TextDefault>
        <TextDefault color="gray">
          Please Inter your email address and password for Login
        </TextDefault>

        <Row
          direction="column"
          rowGap={20}
          full
          style={{
            marginTop: normalize(20),
          }}
        >
          <Input
            placeholder="email"
            text={emailAddress}
            onChangeText={setEmailAddress}
          />
          <InputPassword
            placeholder="password"
            text={password}
            onChangeText={setPassword}
          />
        </Row>

        <Row
          full
          end
          style={{
            marginBottom: normalize(20),
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <TextDefault>Forgot password?</TextDefault>
          </TouchableOpacity>
        </Row>

        <ButtonPrimary
          minWidth={"100%"}
          onPress={onSignInPress}
          title="Login"
          isLoading={loading}
        />

        <Separator height={normalize(20)} />

        <Row center full>
          <TextDefault>Sign In With</TextDefault>
        </Row>

        <Separator height={normalize(20)} />
        <Row full center colGap={20}>
          <IconButton
            icon={
              <Image
                source={IMG.google}
                style={{
                  width: normalize(25),
                  height: normalize(25),
                }}
              />
            }
            onPress={onLoginWithGoogle}
          />
          <IconButton
            icon={<AntDesign name="github" size={24} color="black" />}
            onPress={onLoginWithGoogleWithGithub}
          />
          <IconButton
            icon={<FontAwesome6 name="discord" size={24} color="#5451D6" />}
            onPress={onLoginWithGoogleWithDiscord}
          />
        </Row>
        <Row
          center
          full
          colGap={10}
          style={{
            marginTop: "auto",
            paddingBottom: normalize(20),
          }}
        >
          <TextDefault>Not Registrar Yet?</TextDefault>
          <TouchableOpacity
            onPress={() => {
              router.push("/sign-up");
            }}
          >
            <TextDefault bold color="#6c47ff">
              Sign Up
            </TextDefault>
          </TouchableOpacity>
        </Row>
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 10,
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Login;
