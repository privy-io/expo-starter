import Constants from "expo-constants";
import { Stack } from "expo-router";
import { PrivyProvider } from "@privy-io/expo";
import { PrivyElements } from "@privy-io/expo/ui";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

export default function RootLayout() {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const stripePublishableKey = Constants.expoConfig?.extra?.stripePublishableKey;

  return (
    <PrivyProvider
      appId={Constants.expoConfig?.extra?.privyAppId}
      clientId={Constants.expoConfig?.extra?.privyClientId}
    >
      <StripeProvider
        publishableKey={stripePublishableKey || ""}
        merchantIdentifier="merchant.dev.privy.example"
      >
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
        <PrivyElements />
      </StripeProvider>
    </PrivyProvider>
  );
}
