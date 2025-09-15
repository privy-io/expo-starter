import Constants from "expo-constants";
import { useState } from "react";

import { View, Text, Button, TextInput } from "react-native";
import { useLinkWithPasskey } from "@privy-io/expo/passkey";
import {
  useLinkWithOAuth,
  useLinkEmail,
  useLinkSMS,
  useLinkWithFarcaster,
} from "@privy-io/expo";
export default function LinkAccounts() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const { linkWithFarcaster } = useLinkWithFarcaster({
    onSuccess: () => {
      console.log("Link Farcaster success");
    },
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
  });
  const { sendCode: sendCodeEmail, linkWithCode: linkWithCodeEmail } =
    useLinkEmail({
      onError: (err) => {
        console.log(err);
        setError(JSON.stringify(err.message));
      },
      onLinkSuccess: () => {
        console.log("Link Email success");
      },
      onSendCodeSuccess: () => {
        console.log("Link Email success");
      },
    });
  const { sendCode: sendCodeSMS, linkWithCode: linkWithCodeSMS } = useLinkSMS({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
    onLinkSuccess: () => {
      console.log("Link SMS success");
    },
    onSendCodeSuccess: () => {
      console.log("Link SMS success");
    },
  });

  const { linkWithPasskey } = useLinkWithPasskey({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
  });
  const oauth = useLinkWithOAuth({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
  });
  return (
    <View>
      {/* Links Accounts */}
      <Text>Link Accounts</Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          margin: 10,
          flexWrap: "wrap",
        }}
      >
        {(
          [
            "github",
            "google",
            "discord",
            "apple",
            "twitter",
            "spotify",
            "instagram",
            "tiktok",
            "linkedin",
            "line",
          ] as const
        ).map((provider) => (
          <View key={provider}>
            <Button
              title={`Link ${provider}`}
              disabled={oauth.state.status === "loading"}
              onPress={() => oauth.link({ provider })}
            ></Button>
          </View>
        ))}
      </View>
      <Button
        title="Link Passkey"
        onPress={() =>
          linkWithPasskey({
            relyingParty: Constants.expoConfig?.extra?.passkeyAssociatedDomain,
          })
        }
      />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderBlockColor: "black",
          borderWidth: 1,
          padding: 10,
        }}
      >
        <Text>Link Email</Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {" "}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={{
              borderWidth: 1,
              borderColor: "black",
              padding: 10,
              margin: 10,
              color: "black",
            }}
          />
          <Button title="Get Code" onPress={() => sendCodeEmail({ email })} />
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <TextInput
            value={emailCode}
            onChangeText={setEmailCode}
            placeholder="Code"
            inputMode="numeric"
            style={{
              borderWidth: 1,
              borderColor: "black",
              padding: 10,
              margin: 10,
              color: "black",
            }}
          />
          <Button
            title="Link email"
            onPress={() => linkWithCodeEmail({ code: emailCode, email })}
          />
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderBlockColor: "black",
          borderWidth: 1,
          padding: 10,
        }}
      >
        <Text>Link SMS</Text>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            style={{
              borderWidth: 1,
              borderColor: "black",
              padding: 10,
              margin: 10,
              color: "black",
            }}
          />
          <Button title="Link SMS" onPress={() => sendCodeSMS({ phone })} />
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <TextInput
            value={smsCode}
            onChangeText={setSmsCode}
            placeholder="Code"
            inputMode="numeric"
            style={{
              borderWidth: 1,
              borderColor: "black",
              padding: 10,
              margin: 10,
              color: "black",
            }}
          />
          <Button
            title="Link Code"
            onPress={() => linkWithCodeSMS({ code: smsCode, phone })}
          />
        </View>{" "}
      </View>
      <Button title="Link Farcaster" onPress={() => linkWithFarcaster({})} />
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </View>
  );
}
