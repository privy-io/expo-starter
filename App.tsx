import "react-native-get-random-values";
import "@ethersproject/shims";

import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import {
  PrivyProvider,
  useLoginWithEmail,
  useOAuthFlow,
  usePrivy,
} from "@privy-io/expo";
import { useState } from "react";

const appId = "<your-app-ID>";

function Content() {
  const [email] = useState("");
  const [otp, setOtp] = useState("");

  const { user, logout } = usePrivy();
  const { start } = useOAuthFlow();
  const { sendCode, loginWithCode } = useLoginWithEmail();

  if (user) {
    return (
      <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <View>
          <Text style={{ fontWeight: "bold" }}>User ID:</Text>
          <Text style={{ fontWeight: "normal" }}>{user.id}</Text>
        </View>

        <View>
          <Text style={{ fontWeight: "bold" }}>Created at: </Text>
          <Text style={{ fontWeight: "normal" }}>
            {new Date(user.created_at).toLocaleTimeString()}
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Linked Accounts </Text>
          <Text
            style={{ padding: 10, color: "white", backgroundColor: "gray" }}
          >
            {JSON.stringify(user.linked_accounts, null, 2)}{" "}
          </Text>
        </View>

        <View style={{ width: "100%", backgroundColor: "gray" }}>
          <Button title="Logout" color="white" onPress={logout} />
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />

      <View
        style={{
          width: "50%",
          backgroundColor: "gray",
          margin: 20,
          padding: 5,
        }}
      >
        <Button
          title="Login with google"
          color="white"
          onPress={() => start({ provider: "google" })}
        />
      </View>

      <View
        style={{
          width: "50%",
          backgroundColor: "gray",
          margin: 20,
          padding: 5,
        }}
      >
        <Button
          title="Send Code"
          color="white"
          onPress={() => sendCode({ email })}
        />
      </View>

      <View
        style={{
          padding: 20,
          borderColor: "gray",
          borderWidth: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{ padding: 5 }}
          placeholder="OTP"
          value={otp}
          onChangeText={setOtp}
        />

        <View
          style={{
            width: "50%",
            backgroundColor: "gray",
            margin: 20,
            padding: 5,
          }}
        >
          <Button
            title="Submit Code"
            color="white"
            onPress={() => loginWithCode({ code: otp })}
          />
        </View>
      </View>
    </>
  );
}

export default function App() {
  if (appId === "<your-app-ID>") {
    return (
      <View style={[styles.container, { gap: 20 }]}>
        <Text style={{ fontSize: 15, fontStyle: "italic", color: "blue" }}>
          Fill in your appId prop on{" "}
        </Text>
        <Text style={{ fontSize: 20 }}>{"<PrivyProvider />"}</Text>
      </View>
    );
  }

  return (
    <PrivyProvider appId={appId}>
      <View style={styles.container}>
        <Content />
      </View>
    </PrivyProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
