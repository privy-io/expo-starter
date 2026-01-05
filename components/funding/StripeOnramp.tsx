import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { usePrivy, useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useOnramp } from "@stripe/stripe-react-native";

type OnrampStep =
  | "init"
  | "auth"
  | "registering"
  | "wallet"
  | "payment"
  | "checkout"
  | "complete";

export default function StripeOnramp() {
  const { user } = usePrivy();
  const { wallets } = useEmbeddedEthereumWallet();
  const {
    configure,
    hasLinkAccount,
    registerLinkUser,
    authenticateUser,
    registerWalletAddress,
    collectPaymentMethod,
    createCryptoPaymentToken,
    performCheckout,
  } = useOnramp();

  const [step, setStep] = useState<OnrampStep>("init");
  const [cryptoCustomerId, setCryptoCustomerId] = useState<string | null>(null);
  const [amount, setAmount] = useState("100");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the onramp coordinator on mount
  useEffect(() => {
    const initOnramp = async () => {
      try {
        const result = await configure({
          appearance: {
            colors: {
              primary: "#6366F1",
            },
          },
        });
        if (result.error) {
          console.error("Failed to configure onramp:", result.error);
        }
      } catch (e) {
        console.error("Error configuring onramp:", e);
      }
    };
    initOnramp();
  }, [configure]);

  // Check Link account status
  const handleCheckLinkAccount = async () => {
    const email = user?.email?.address;
    if (!email) {
      Alert.alert("Error", "Please link an email address first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await hasLinkAccount(email);

      if (result.hasLinkAccount) {
        // User has a Link account, authenticate them
        setStep("auth");
        const authResult = await authenticateUser();
        if (authResult.customerId) {
          setCryptoCustomerId(authResult.customerId);
          setStep("wallet");
        } else if (authResult.error) {
          setError(`Authentication failed: ${authResult.error.message}`);
          setStep("init");
        }
      } else {
        // User needs to register
        setStep("registering");
      }
    } catch (e: any) {
      setError(e.message || "Failed to check Link account");
      setStep("init");
    } finally {
      setIsLoading(false);
    }
  };

  // Register new Link user
  const handleRegisterLinkUser = async () => {
    const email = user?.email?.address;
    if (!email || !phone) {
      Alert.alert("Error", "Please provide email and phone number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await registerLinkUser({
        email,
        phone, // E.164 format expected
        country: "US",
        fullName: undefined, // Optional, recommended for non-US users
      });

      if (result.customerId) {
        setCryptoCustomerId(result.customerId);
        setStep("wallet");
      } else if (result.error) {
        setError(`Registration failed: ${result.error.message}`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to register Link user");
    } finally {
      setIsLoading(false);
    }
  };

  // Register wallet address
  const handleRegisterWallet = async () => {
    const wallet = wallets[0];
    if (!wallet) {
      Alert.alert("Error", "No embedded wallet found. Please create one first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await registerWalletAddress(wallet.address, "base");

      if (!result.error) {
        setStep("payment");
      } else {
        setError(`Wallet registration failed: ${result.error.message}`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to register wallet");
    } finally {
      setIsLoading(false);
    }
  };

  // Collect payment method
  const handleCollectPaymentMethod = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await collectPaymentMethod("Card");

      if (result.paymentDisplayData) {
        setStep("checkout");
      } else if (result.error) {
        setError(`Payment method collection failed: ${result.error.message}`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to collect payment method");
    } finally {
      setIsLoading(false);
    }
  };

  // Execute checkout
  const handleCheckout = async () => {
    if (!cryptoCustomerId) {
      Alert.alert("Error", "No crypto customer ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create payment token
      const tokenResult = await createCryptoPaymentToken();
      if (!tokenResult.cryptoPaymentToken) {
        setError("Failed to create payment token");
        return;
      }

      // NOTE: In a real implementation, you would:
      // 1. Call your backend to create an onramp session
      // 2. Call performCheckout with the session ID
      //
      // For this demo, we'll show the flow without a backend
      Alert.alert(
        "Backend Required",
        "To complete the onramp, you need to:\n\n" +
          "1. Create an onramp session on your backend using POST /v1/crypto/onramp_sessions\n\n" +
          "2. Call performCheckout with the session ID\n\n" +
          `Payment token: ${tokenResult.cryptoPaymentToken}\n` +
          `Customer ID: ${cryptoCustomerId}\n` +
          `Amount: $${amount} USD\n` +
          `Destination: USDC on Base`
      );

      setStep("complete");
    } catch (e: any) {
      setError(e.message || "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset flow
  const handleReset = () => {
    setStep("init");
    setCryptoCustomerId(null);
    setError(null);
    setPhone("");
    setAmount("100");
  };

  const email = user?.email?.address;
  const wallet = wallets[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Crypto Onramp</Text>
      <Text style={styles.subtitle}>
        Fund your wallet with fiat using Stripe
      </Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {step === "init" && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 1: Connect to Stripe Link</Text>
          {email ? (
            <Text style={styles.info}>Email: {email}</Text>
          ) : (
            <Text style={styles.warning}>
              Please link an email address first
            </Text>
          )}
          <Button
            title={isLoading ? "Checking..." : "Connect with Link"}
            onPress={handleCheckLinkAccount}
            disabled={isLoading || !email}
          />
        </View>
      )}

      {step === "auth" && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Authenticating...</Text>
          <Text style={styles.info}>
            Please complete the verification in the Stripe UI
          </Text>
        </View>
      )}

      {step === "registering" && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 2: Register with Link</Text>
          <Text style={styles.info}>Email: {email}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number (E.164 format, e.g., +14155551234)"
            keyboardType="phone-pad"
          />
          <Button
            title={isLoading ? "Registering..." : "Register"}
            onPress={handleRegisterLinkUser}
            disabled={isLoading || !phone}
          />
        </View>
      )}

      {step === "wallet" && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 3: Register Wallet</Text>
          {wallet ? (
            <>
              <Text style={styles.info}>
                Wallet: {wallet.address.slice(0, 10)}...
                {wallet.address.slice(-8)}
              </Text>
              <Text style={styles.info}>Network: Base</Text>
              <Button
                title={isLoading ? "Registering..." : "Register Wallet"}
                onPress={handleRegisterWallet}
                disabled={isLoading}
              />
            </>
          ) : (
            <Text style={styles.warning}>
              No embedded wallet found. Please create one first.
            </Text>
          )}
        </View>
      )}

      {step === "payment" && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 4: Add Payment Method</Text>
          <Button
            title={isLoading ? "Collecting..." : "Add Card"}
            onPress={handleCollectPaymentMethod}
            disabled={isLoading}
          />
        </View>
      )}

      {step === "checkout" && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Step 5: Checkout</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount in USD"
            keyboardType="numeric"
          />
          <Text style={styles.info}>Destination: USDC on Base</Text>
          <Button
            title={isLoading ? "Processing..." : `Buy $${amount} of USDC`}
            onPress={handleCheckout}
            disabled={isLoading}
          />
        </View>
      )}

      {step === "complete" && (
        <View style={styles.stepContainer}>
          <Text style={styles.successText}>Flow Complete!</Text>
          <Text style={styles.info}>
            In a production app, the USDC would be delivered to your wallet
            after the backend completes the onramp session.
          </Text>
          <Button title="Start Over" onPress={handleReset} />
        </View>
      )}

      {step !== "init" && step !== "complete" && (
        <Button title="Cancel" onPress={handleReset} color="#666" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  stepContainer: {
    marginVertical: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  warning: {
    fontSize: 14,
    color: "#f59e0b",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 8,
  },
});
