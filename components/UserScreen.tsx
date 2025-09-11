import React, { useState, useCallback } from "react";
import { Text, TextInput, View, Button, ScrollView } from "react-native";

import {
  usePrivy,
  useEmbeddedEthereumWallet,
  getUserEmbeddedEthereumWallet,
  PrivyEmbeddedWalletProvider,
  useLinkWithOAuth,
} from "@privy-io/expo";
import Constants from "expo-constants";
import { useLinkWithPasskey } from "@privy-io/expo/passkey";
import { PrivyUser, WalletAddress } from "@privy-io/public-api";
import LinkAccounts from "./userManagement/LinkAccounts";
import UnlinkAccounts from "./userManagement/UnlinkAccounts";
import Wallets from "./userManagement/Wallets";
import SolanaWalletActions from "./walletActions/SolanaWalletActions";
import EVMWalletActions from "./walletActions/EVMWalletActions";

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

  return x.type;
};

export const UserScreen = () => {
  const [chainId, setChainId] = useState("1");
  const [signedMessages, setSignedMessages] = useState<string[]>([]);

  const { logout, user } = usePrivy();
  const { linkWithPasskey } = useLinkWithPasskey();
  const oauth = useLinkWithOAuth();
  const { wallets, create } = useEmbeddedEthereumWallet();
  const account = getUserEmbeddedEthereumWallet(user);

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
    [account?.address]
  );

  const switchChain = useCallback(
    async (provider: PrivyEmbeddedWalletProvider, id: string) => {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }],
        });
        alert(`Chain switched to ${id} successfully`);
      } catch (e) {
        console.error(e);
      }
    },
    [account?.address]
  );

  if (!user) {
    return null;
  }

  return (
    <ScrollView>
      <LinkAccounts />
      <UnlinkAccounts />
      <Wallets />
      <ScrollView style={{ borderColor: "rgba(0,0,0,0.1)", borderWidth: 1 }}>
        <View
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold" }}>User ID</Text>
            <Text>{user.id}</Text>
          </View>

          <View>
            <Text style={{ fontWeight: "bold" }}>Linked accounts</Text>
            {user?.linked_accounts.length ? (
              <View style={{ display: "flex", flexDirection: "column" }}>
                {user?.linked_accounts?.map((m, index) => (
                  <Text
                    key={`linked-account-${m.type}-${m.verified_at}-${index}`}
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
                <Text style={{ fontWeight: "bold" }}>Embedded Wallet</Text>
                <Text>{account?.address}</Text>
              </>
            )}

            <>
              <Text>Chain ID to set to:</Text>
              <TextInput
                value={chainId}
                onChangeText={setChainId}
                placeholder="Chain Id"
              />
              <Button
                title="Switch Chain"
                onPress={async () =>
                  switchChain(await wallets[0].getProvider(), chainId)
                }
              />
            </>
          </View>

          <SolanaWalletActions />
          <EVMWalletActions />
          <Button title="Logout" onPress={logout} />
        </View>
      </ScrollView>
    </ScrollView>
  );
};
