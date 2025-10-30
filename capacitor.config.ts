import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.replit.medical.ai',
  appName: '医療問診AI',
  webDir: 'dist/public',
  server: {
    url: 'https://gpt-i-phone-fujikawa.replit.app',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
