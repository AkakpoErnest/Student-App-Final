import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appName: 'studenverse-market-hub',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    },
    StatusBar: {
      style: 'DEFAULT'
    }
  }
};

export default config;
