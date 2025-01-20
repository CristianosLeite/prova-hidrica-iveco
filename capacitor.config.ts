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
    },
    IposPrinterPlugin: {
      android: {
        class: 'com.conecsa.ipos.printer',
      }
    }
  }
}

export default config;
