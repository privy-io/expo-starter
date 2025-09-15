import { useState } from "react";
import { View, Button, Text } from "react-native";
import { useLoginWithOAuth } from "@privy-io/expo";
import { LoginWithOAuthInput } from "@privy-io/expo";

export default function OAuth() {
  const [error, setError] = useState("");
  const oauth = useLoginWithOAuth({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
  });
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          margin: 10,
        }}
      >
        {[
          "github",
          "google",
          "discord",
          "apple",
          "twitter",
          "tiktok",
          "spotify",
          "instagram",
          "linkedin",
          "line",
        ].map((provider) => (
          <View key={provider}>
            <Button
              title={`Login with ${provider}`}
              disabled={oauth.state.status === "loading"}
              onPress={() => oauth.login({ provider } as LoginWithOAuthInput)}
            ></Button>
          </View>
        ))}
      </View>
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </View>
  );
}
