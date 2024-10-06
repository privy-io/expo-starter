# Privy Expo Starter

This demonstrates a minimal working installation of the privy sdk in a fresh expo app. We recommend reading the [documentation](https://docs.privy.io/guide/expo/dashboard) for a more detailed guide.

## Setup

1. Install dependencies

   ```sh
   npm i
   ```

2. Configure an app client in your [dashboard](https://dashboard.privy.io/apps?page=settings&setting=client), and add your Privy app ID and app client ID in `app.json`

   ```json
   ...
    "extra": {
      "privyAppId": "<your-app-id>",
      "privyClientId": "<your-client-id>"
    }
   ...
   ```

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

## Run the app

```sh
# expo go
npm start

# ios
npm run ios

# android
npm run android
```
