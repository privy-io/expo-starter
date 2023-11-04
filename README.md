# Privy Expo Starter

This demonstrates a minimal working installation of the privy sdk in a fresh
expo app.

## Setup

1. Install dependencies

   ```sh
   npm i
   ```

1. Add your Privy app ID in `App.js`

   ```jsx
   export default function App() {
     return (
       <PrivyProvider appId="<your-privy-app-id>">
         <View style={styles.container}>
           <Content />
         </View>
       </PrivyProvider>
     );
   }
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
