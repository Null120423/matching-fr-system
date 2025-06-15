import { IMG } from "@/assets/images";
import { Input, InputPassword } from "@/components/@core";
import { ButtonPrimary } from "@/components/@core/button";
import Row from "@/components/@core/row";
import Separator from "@/components/@core/separator";
import TextDefault from "@/components/@core/text-default";
import { normalize } from "@/helper/helpers";
import DefaultLayout from "@/layouts/default-layout";
import { useSignUp } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "../header";

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout imgBackground={IMG.signInBg}>
      <Header title="" />
      <View style={[styles.container]}>
        <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
        <TextDefault bold size={normalize(22)}>
          Create an account
        </TextDefault>
        <TextDefault color="gray">
          Please Inter your email address and password for Login
        </TextDefault>
        <Separator height={normalize(20)} />
        {!pendingVerification && (
          <Row start direction="column" rowGap={10} full>
            <Row direction="column" rowGap={20} full>
              <Input
                placeholder="simon@galaxies.dev"
                text={emailAddress}
                onChangeText={setEmailAddress}
              />

              <InputPassword
                placeholder="password"
                text={password}
                onChangeText={setPassword}
              />

              <InputPassword
                placeholder="Confirm password"
                text={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Row>
            <Separator height={normalize(20)} />
            <ButtonPrimary
              isLoading={loading}
              minWidth={"100%"}
              onPress={onSignUpPress}
              title="Sign Up"
            />
          </Row>
        )}

        {pendingVerification && (
          <Fragment>
            <Input
              placeholder="Code..."
              keyBroadType="numeric"
              text={code}
              onChangeText={setCode}
            />
            <Separator height={normalize(20)} />
            <ButtonPrimary
              minWidth={"100%"}
              onPress={onPressVerify}
              title="Verify Email"
              isLoading={loading}
            />
          </Fragment>
        )}
      </View>
    </DefaultLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default Register;
