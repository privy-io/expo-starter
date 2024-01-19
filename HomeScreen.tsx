import React, {useState, useCallback} from "react";
import {Text, TextInput, View, ScrollView} from "react-native";

import {
  usePrivy,
  useOAuthFlow,
  useEmbeddedWallet,
  getUserEmbeddedWallet,
  PrivyEmbeddedWalletProvider,
} from "@privy-io/expo";
import {PrivyUser} from "@privy-io/public-api";

import {Button} from "./Button";
import {styles} from "./styles";

const toMainIdentifier = (x: PrivyUser["linked_accounts"][number]) => {
  if (x.type === "phone") {
    return x.phoneNumber;
  }
  if (x.type === "email" || x.type === "wallet") {
    return x.address;
  }

  if (x.type === "twitter_oauth" || x.type === "tiktok_oauth") {
    return x.username;
  }

  if (x.type === "custom_auth") {
    return x.custom_user_id;
  }

  return x.email;
};

export const HomeScreen = () => {
  const [password, setPassword] = useState("");
  const [chainId, setChainId] = useState("1");
  const [signedMessages, setSignedMessages] = useState<string[]>([]);

  const {logout, user} = usePrivy();
  const oauth = useOAuthFlow();
  const wallet = useEmbeddedWallet();
  const account = getUserEmbeddedWallet(user);

  const signMessage = useCallback(
    async (provider: PrivyEmbeddedWalletProvider) => {
      try {
        const message = await provider.request({
          method: "personal_sign",
          params: [`0x0${Date.now()}`, account?.address],
        });
        if (message) {
          setSignedMessages((prev) => prev.concat(message));
        }
      } catch (e) {
        console.error(e);
      }
    },
    [account?.address],
  );

  const switchChain = useCallback(
    async (provider: PrivyEmbeddedWalletProvider, id: string) => {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{chainId: id}],
        });
        alert(`Chain switched to ${id} successfully`);
      } catch (e) {
        console.error(e);
      }
    },
    [account?.address],
  );

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Button onPress={logout}>Logout</Button>

      <View style={{display: "flex", flexDirection: "row", gap: 5, margin: 10}}>
        {(["github", "google", "discord", "apple"] as const).map((provider) => (
          <View key={provider}>
            <Button
              disabled={oauth.state.status === "loading"}
              loading={oauth.state.status === "loading"}
              onPress={() => oauth.start({provider})}
            >
              {`Link ${provider}`}
            </Button>
          </View>
        ))}
      </View>

      {wallet.status === "needs-recovery" && (
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={styles.input}
        />
      )}

      <ScrollView style={{borderColor: "rgba(0,0,0,0.1)", borderWidth: 1}}>
        <View
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <View>
            <Text style={{fontWeight: "bold"}}>User ID</Text>
            <Text>{user.id}</Text>
          </View>

          <View>
            <Text style={{fontWeight: "bold"}}>Linked accounts</Text>
            {user?.linked_accounts.length ? (
              <View style={{display: "flex", flexDirection: "column"}}>
                {user?.linked_accounts?.map((m) => (
                  <Text
                    key={m.verified_at}
                    style={{
                      color: "rgba(0,0,0,0.5)",
                      fontSize: 12,
                      fontStyle: "italic",
                    }}
                  >
                    {m.type}: {toMainIdentifier(m)}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>

          <View>
            {account?.address && (
              <>
                <Text style={{fontWeight: "bold"}}>Embedded Wallet</Text>
                <Text>{account?.address}</Text>
              </>
            )}

            {wallet.status === "connecting" && <Text>Loading wallet...</Text>}

            {wallet.status === "error" && <Text>{wallet.error}</Text>}

            {wallet.status === "not-created" && (
              <Button onPress={() => wallet.create()}>Create Wallet</Button>
            )}

            {wallet.status === "connected" && (
              <Button onPress={() => signMessage(wallet.provider)}>
                Sign Message
              </Button>
            )}

            {wallet.status === "connected" && (
              <>
                <TextInput
                  value={chainId}
                  onChangeText={setChainId}
                  placeholder="Chain Id"
                  style={styles.inputSm}
                />
                <Button onPress={() => switchChain(wallet.provider, chainId)}>
                  Switch Chain
                </Button>
              </>
            )}

            {wallet.status === "needs-recovery" && (
              <Button onPress={() => wallet.recover(password)}>
                Recover Wallet
              </Button>
            )}
          </View>

          <View style={{display: "flex", flexDirection: "column"}}>
            {signedMessages.map((m) => (
              <React.Fragment key={m}>
                <Text
                  style={{
                    color: "rgba(0,0,0,0.5)",
                    fontSize: 12,
                    fontStyle: "italic",
                  }}
                >
                  {m}
                </Text>
                <View
                  style={{
                    marginVertical: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(0,0,0,0.2)",
                  }}
                />
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
