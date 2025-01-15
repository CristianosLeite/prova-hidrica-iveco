import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

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
        return result.ScanResult;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Erro ao escanear o código de barras');
    }
  }
}
