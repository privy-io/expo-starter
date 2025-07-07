import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import Constants from "expo-constants";
import { LoginScreen, UserScreen } from "@/features/authentication";
import { usePrivy } from "@privy-io/expo";

export default function Index() {
  const { user } = usePrivy();
  if ((Constants.expoConfig?.extra?.privyAppId as string).length !== 25) {
    return (
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>You have not set a valid `privyAppId` in app.json</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (
    !(Constants.expoConfig?.extra?.privyClientId as string).startsWith(
      "client-"
    )
  ) {
    return (
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>You have not set a valid `privyClientId` in app.json</Text>
        </View>
      </SafeAreaView>
    );
  }
  return !user ? <LoginScreen /> : <UserScreen />;
}
