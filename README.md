# Privy Expo Starter

This demonstrates a minimal working installation of the privy sdk in a fresh expo app. We recommend reading the [documentation](https://docs.privy.io/guide/expo/dashboard) for a more detailed guide.

## Setup

1. Install dependencies

   ```sh
   yarn
   ```

2. Configure an app client in your [Dashboard](https://dashboard.privy.io/apps?page=settings&setting=clients), and add your Privy app ID and app client ID in `app.json`

   ```json
   ...
    "extra": {
      "privyAppId": "<your-app-id>",
      "privyClientId": "<your-client-id>"
    }
   ...
   ```

   If you are using Expo go, be sure to add `host.exp.Exponent` to Allowed app identifiers under app clients in your [Dashboard]('https://dashboard.privy.io/apps?page=settings&setting=clients')

3. Configure your application identifier in `app.json`. This should match the bundle identifier for your app in the app store.

   ```json
   ...
    "ios": {
      "bundleIdentifier": "com.example.myapp"
    },
    "android": {
      "package": "com.example.myapp"
    }
   ...
   ```

4. If you are making use of passkeys, ensure that you have an [associated website](https://docs.privy.io/guide/expo/setup/passkey#_3-update-native-app-settings) for your application. Once you have this your `app.json` should be updated as follows:

   ```json
   ...
   "associatedDomains": ["webcredentials:<your-associated-domain>"],
   ...
   "extra": {
      ...
      "passkeyAssociatedDomain": "https://<your-associated-domain>"
    },
   ...
   ```

## Run the app

```sh
# expo go
yarn run start

# ios
yarn run ios

# android
yarn run android
```
