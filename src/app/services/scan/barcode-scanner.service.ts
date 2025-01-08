import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {
  constructor() { }

  async startScan(hint: number = 17, cameraDirection: number = 1, scanOrientation: number = 3): Promise<string | null> {
    try {
      const options = {
        hint: hint,
        cameraDirection: cameraDirection,
        scanOrientation: scanOrientation,
      };

      const result = await CapacitorBarcodeScanner.scanBarcode(options);

      if (result && result.ScanResult) {
        console.log('Código de barras escaneado:', result.ScanResult);
        return result.ScanResult;
      } else {
        console.log('Nenhum código de barras escaneado ou resultado inválido');
        return null;
      }
    } catch (error) {
      console.error('Erro ao escanear o código de barras:', error);
      throw new Error('Erro ao escanear o código de barras');
    }
  }
}
