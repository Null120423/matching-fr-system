import { IMG } from "@/assets/images";
import { Input, InputPassword } from "@/components/@core";
import { ButtonPrimary } from "@/components/@core/button";
import Row from "@/components/@core/row";
import Separator from "@/components/@core/separator";
import { normalize } from "@/helper/helpers";
import DefaultLayout from "@/layouts/default-layout";
import { useSignIn } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "../header";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    setLoading(true);
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
      setLoading(false);
    } catch (err: any) {
      alert(err.errors[0].message);
      setLoading(false);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    setLoading(true);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      setLoading(false);
      alert("Password reset successfully");

      // Set the user session active, which will log in the user automatically
      setActive && (await setActive({ session: result?.createdSessionId }));
    } catch (err: any) {
      alert(err.errors[0].message);
      setLoading(false);
    }
  };

  return (
    <DefaultLayout imgBackground={IMG.signInBg}>
      <Header title="Reset Password" />
      <View style={styles.container}>
        <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />
        {!successfulCreation && (
          <>
            <Input
              placeholder="simon@galaxies.dev"
              text={emailAddress}
              onChangeText={setEmailAddress}
            />

            <Separator height={normalize(20)} />

            <ButtonPrimary
              minWidth={"100%"}
              onPress={onRequestReset}
              title="Send Reset Email"
              isLoading={loading}
            />
          </>
        )}

        {successfulCreation && (
          <>
            <Row full direction="column" rowGap={20} start>
              <Input text={code} placeholder="Code..." onChangeText={setCode} />
              <InputPassword
                text={password}
                placeholder="New password"
                onChangeText={setPassword}
              />
              <InputPassword
                text={confirmPassword}
                placeholder="New confirm password"
                onChangeText={setConfirmPassword}
              />
            </Row>
            <Separator height={normalize(20)} />
            <ButtonPrimary
              isLoading={loading}
              minWidth={"100%"}
              onPress={onReset}
              title="Set new Password"
            />
          </>
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

export default PwReset;
