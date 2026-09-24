import { CapacitorConfig } from '@capacitor/core';

/**
 * Capacitor config — turns the built web app into a real Android project
 * you can open directly in Android Studio.
 *
 * This file is picked up automatically once you run `npx cap init`
 * (see ANDROID_SETUP.md in the project root for the exact commands).
 */
const config: CapacitorConfig = {
  appId: 'com.foodwise.rwp',
  appName: 'FoodWise RWP',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // If you're running the FastAPI backend on your development machine
    // and testing on a physical device/emulator, Android needs your
    // machine's LAN IP (not "localhost") to reach it. Set this in your
    // frontend .env as: VITE_API_BASE_URL=http://10.0.2.2:8000
    // (10.0.2.2 is the special alias the Android *emulator* uses for
    // your host machine's localhost; a real device needs your PC's
    // actual LAN IP address instead, e.g. http://192.168.1.5:8000)
  },
};

export default config;
