import Constants from "expo-constants";
import { useState } from "react";
import { Button, Text } from "react-native";

import { useLoginWithPasskey } from "@privy-io/expo/passkey";

export default function PasskeyLogin() {
  const [error, setError] = useState("");
  const { loginWithPasskey } = useLoginWithPasskey({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
  });
  return (
    <>
      <Button
        title="Login using Passkey"
        onPress={() =>
          loginWithPasskey({
            relyingParty: Constants.expoConfig?.extra?.passkeyAssociatedDomain,
          })
        }
      />
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </>
  );
}
