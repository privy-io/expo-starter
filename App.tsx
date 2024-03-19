Object.assign(window, {
  addEventListener: () => 0,
  removeEventListener: () => {},
  dispatchEvent: () => true,
  CustomEvent: class CustomEvent {} as any,
});

import "fast-text-encoding";
import "node-libs-expo/globals";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import "@ethersproject/shims";

import Constants from "expo-constants";
import React from "react";
import {SafeAreaView, View, Text} from "react-native";

import {PrivyProvider} from "@privy-io/expo";

import {Wrapper} from "./Wrapper";
import {WagmiProvider, createConfig, http} from "wagmi";
import {mainnet, sepolia} from "viem/chains";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {EmbeddedWalletProvider} from "./Wagmi";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, sepolia], // Pass your required chains as an array
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
});

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
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <EmbeddedWalletProvider>
            <SafeAreaView style={{flex: 1, margin: 10}}>
              <Wrapper />
            </SafeAreaView>
          </EmbeddedWalletProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
