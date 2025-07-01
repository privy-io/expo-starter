// entrypoint.js

// Import required polyfills first
// IMPORTANT: These polyfills must be installed in this order
import "react-native-get-random-values";
import { Buffer } from "buffer";
import "@ethersproject/shims";

// Set global Buffer
global.Buffer = Buffer;

// Then import the expo router
import "expo-router/entry";
