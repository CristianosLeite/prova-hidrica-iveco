import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BarcodeScannerService } from 'src/app/services/scan/barcode-scanner.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit {
  public scannedCode?: string;
  public hasError = false;

  constructor(private readonly barcodeService: BarcodeScannerService) {}

  ngOnInit() {
    this.scanBarCode();
  }

  async scanBarCode() {
    try {
      const code = await this.barcodeService.startScan(17, 1);
      if (code) {
        this.scannedCode = code;
      }
    } catch (error) {
      console.error('Erro ao escanear código de barras:', error);
      this.hasError = true;
    }
  }
}
