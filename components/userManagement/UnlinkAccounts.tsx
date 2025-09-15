import Constants from "expo-constants";
import { useState } from "react";
import { View, Text, Button } from "react-native";

import { usePrivy, useUnlinkOAuth, useUnlinkFarcaster } from "@privy-io/expo";
export default function UnlinkAccounts() {
  const [error, setError] = useState("");
  const { user } = usePrivy();
  const { unlinkFarcaster } = useUnlinkFarcaster({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
    onSuccess: () => {
      console.log("Unlink Farcaster success");
    },
  });
  const oauth = useUnlinkOAuth({
    onError: (err) => {
      console.log(err);
      setError(JSON.stringify(err.message));
    },
  });

  return (
    <View>
      {/* Links Accounts */}
      <Text>Unlink Accounts</Text>

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
              title={`Unlink ${provider}`}
              onPress={() =>
                oauth.unlinkOAuth({
                  provider,
                  subject: (
                    user?.linked_accounts.find(
                      (account) => (account as any).type === `${provider}_oauth`
                    ) as any
                  )?.subject,
                })
              }
              disabled={
                user?.linked_accounts.find(
                  (account) => (account as any).type === `${provider}_oauth`
                ) === undefined
              }
            ></Button>
          </View>
        ))}
      </View>
      <Button
        title="Unlink Farcaster"
        disabled={
          user?.linked_accounts.find(
            (account) => (account as any).type === "farcaster"
          ) === undefined
        }
        onPress={() => {
          const farcasterAccount = user?.linked_accounts.find(
            (account) => (account as any).type === "farcaster"
          ) as any | undefined;
          if (!farcasterAccount) return;
          unlinkFarcaster({ fid: farcasterAccount.fid });
        }}
      />
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </View>
  );
}
