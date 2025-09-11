import { useState } from "react";
import { useLoginWithSMS } from "@privy-io/expo";
import { Button, Text, TextInput, View } from "react-native";

export default function SMSLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const { sendCode, loginWithCode } = useLoginWithSMS();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: "black",
      }}
    >
      <Text>SMS Login</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          inputMode="tel"
          style={{
            borderWidth: 1,
            borderColor: "black",
            padding: 10,
            margin: 10,
            color: "black",
          }}
        />
        <Button onPress={() => sendCode({ phone })} title="Send Code" />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          value={code}
          onChangeText={setCode}
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
        <Button onPress={() => loginWithCode({ code, phone })} title="Login" />
      </View>
    </View>
  );
}
