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
  ngOnInit() {}

  isToast = false;
  toastData: any = {};

  constructor(private barcodeService: BarcodeScannerService) {}

  async scanBarCode() {
    try {
      const code = await this.barcodeService.startScan(2);
      if (!code) {
        this.isToast = true;
        this.toastData = {
          message: 'Nenhum código de barras encontrado',
          color: 'danger'
        };
        return;
      }
      console.log(code); 
    } catch (error) {
      console.error(error);
    }
  }

}
