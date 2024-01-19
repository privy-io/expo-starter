import "react-native-get-random-values";
import "@ethersproject/shims";

import Constants from "expo-constants";
import React from "react";
import {SafeAreaView, View, Text} from "react-native";

import {PrivyProvider} from "@privy-io/expo";

import {Wrapper} from "./Wrapper";

export default function App() {
  if (Constants.expoConfig?.extra?.privyAppId === "<your-app-id>") {
    return (
      <SafeAreaView>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Set your app id in app.json</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <PrivyProvider appId={Constants.expoConfig?.extra?.privyAppId}>
      <SafeAreaView style={{flex: 1, margin: 10}}>
        <Wrapper />
      </SafeAreaView>
    </PrivyProvider>
  );
}
