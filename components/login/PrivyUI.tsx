import { useLogin } from "@privy-io/expo/ui";
import { Button, View, Text } from "react-native";
import { useState } from "react";

export default function PrivyUI() {
  const [error, setError] = useState("");

  const { login } = useLogin();
  return (
    <View>
      <Button
        title="Login with Privy UIs"
        onPress={() => {
          login({ loginMethods: ["email"] })
            .then((session) => {
              console.log("User logged in", session.user);
            })
            .catch((err) => {
              setError(JSON.stringify(err.error) as string);
            });
        }}
      />
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </View>
  );
}
