import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.conecsa.provahidrica',
  appName: 'Prova Hídrica IVECO',
  webDir: 'www/browser',
  server: {
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
}

export default config;
