import { useEmbeddedSolanaWallet } from "@privy-io/expo";
import { View, Text, Button } from "react-native";
import { useState } from "react";

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export default function SolanaWalletActions() {
  const { wallets } = useEmbeddedSolanaWallet();
  const wallet = wallets?.[0];
  const [result, setResult] = useState<string | null>(null);

  const signMessage = async () => {
    try {
      if (!wallet?.getProvider) return;
      const provider = await wallet.getProvider?.();
      if (!provider) return;
      const message = "Hello world";
      const { signature } = await provider.request({
        method: "signMessage",
        params: { message },
      });
      setResult(signature);
    } catch (err: any) {
      setResult(err?.message ?? String(err));
    }
  };

  const signTransaction = async () => {
    try {
      if (!wallet?.getProvider) return;
      const provider = await wallet.getProvider?.();
      if (!provider) return;

      const transaction = new Transaction();
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("finalized")
      ).blockhash;
      transaction.feePayer = new PublicKey(wallet.publicKey);
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.publicKey),
          toPubkey: new PublicKey(
            "So11111111111111111111111111111111111111112", // Replace with a valid recipient address
          ),
          lamports: 1000, // Amount in lamports (1 SOL = 1,000,000,000 lamports)
        }),
      );
      // Sign the transaction
      const { signedTransaction } = await provider.request({
        method: "signTransaction",
        params: { transaction },
      });
      setResult(JSON.stringify(signedTransaction));
    } catch (err: any) {
      setResult(err?.message ?? String(err));
    }
  };

  const signAndSendTransaction = async () => {
    try {
      if (!wallet?.getProvider) return;
      const provider = await wallet.getProvider?.();
      if (!provider) return;
      const transaction = new Transaction();
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("finalized")
      ).blockhash;
      transaction.feePayer = new PublicKey(wallet.publicKey);
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.publicKey),
          toPubkey: new PublicKey(
            "So11111111111111111111111111111111111111112", // Replace with a valid recipient address
          ),
          lamports: 1000, // Amount in lamports (1 SOL = 1,000,000,000 lamports)
        }),
      );
      const { signature } = await provider.request({
        method: "signAndSendTransaction",
        params: {
          transaction: transaction,
          connection: connection,
        },
      });
      setResult(signature);
    } catch (err: any) {
      setResult(err?.message ?? String(err));
    }
  };
  return (
    <View>
      <Text>Solana Wallet Actions</Text>
      <Button title="Sign Message" onPress={signMessage} />
      <Button title="Sign Transaction" onPress={signTransaction} />
      <Button
        title="Sign And Send Transaction"
        onPress={signAndSendTransaction}
      />
      {result && <Text>{result}</Text>}
    </View>
  );
}
