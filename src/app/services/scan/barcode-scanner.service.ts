import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {
  constructor() { }

  async startScan(val?: number) {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: val || 17,
        cameraDirection: 1
      });
      console.log(result);
      return result.ScanResult;
      
    } catch (error) {
      throw error;
  }
}
}
