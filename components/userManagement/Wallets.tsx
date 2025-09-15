import {
  useEmbeddedEthereumWallet,
  useEmbeddedSolanaWallet,
  usePrivy,
} from "@privy-io/expo";
import { useCreateWallet } from "@privy-io/expo/extended-chains";
import { View, Text, Button } from "react-native";
import { useState } from "react";

export default function Wallets() {
  const [error, setError] = useState<string | null>(null);
  const { user } = usePrivy();
  const { create: createEthereumWallet } = useEmbeddedEthereumWallet();
  const { create: createSolanaWallet } = useEmbeddedSolanaWallet();
  const { createWallet } = useCreateWallet();
  const wallets = user?.linked_accounts.filter(
    (account) => account.type === "wallet",
  );

  type ExtendedChainType =
    | "bitcoin-segwit"
    | "stellar"
    | "cosmos"
    | "sui"
    | "tron"
    | "near"
    | "ton"
    | "spark";
  type chainTypes = "ethereum" | "solana" | ExtendedChainType;

  const ALL_CHAIN_TYPES: chainTypes[] = [
    "ethereum",
    "solana",
    "bitcoin-segwit",
    "stellar",
    "cosmos",
    "sui",
    "tron",
    "near",
    "ton",
    "spark",
  ];

  const createWallets = (chainType: chainTypes) => {
    switch (chainType) {
      case "ethereum":
        return createEthereumWallet({ createAdditional: true });
      case "solana":
        return createSolanaWallet?.({
          createAdditional: true,
          recoveryMethod: "privy",
        });

      default:
        return createWallet({
          chainType: chainType as ExtendedChainType,
        }).catch((err: any) => {
          console.log(err);
          setError(err?.message ? String(err.message) : String(err));
        });
    }
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
      }}
    >
      <Text>Wallets</Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {ALL_CHAIN_TYPES.map((chainType, i) => (
          <Button
            key={`create-wallet-${chainType}-${i}`}
            title={`Create ${chainType} Wallet`}
            onPress={() => createWallets(chainType)}
          />
        ))}
      </View>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}
