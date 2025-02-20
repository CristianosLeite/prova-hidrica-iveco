import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Context } from 'src/app/types/context.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { ScannerPlugin } from 'q2i-scanner-plugin';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit {
  @Input() context: Context | undefined;
  public title: string = 'Aguardando leitura do VP';
  public subtitle: string = 'Utilize o leitor de código de barras.';
  public content: string = 'Aguardando leitura...';
  public scannedCode?: string;
  public hasError = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.codeBarsReader().then((response: SocketResponse) => {
      console.log('Codebar response', response);
      this.content = response.payload.message;
    }).catch((data: any) => {
      console.error('Error reading code bars:', data['payload']['message']);
      this.title = 'Erro ao ler o código de barras.';
      this.subtitle = data['payload']['message'];
      this.content = '';

      setTimeout(() => {
        this.title = 'Aguardando leitura do VP';
        this.subtitle = 'Utilize o leitor de código de barras.';
        this.content = 'Aguardando leitura...';
      }, 5000);
    });
  }

  async scan() {
    try {
      ScannerPlugin.scanBarcode().then((result) => {
        console.log('Código de barras escaneado:', result.value);
      });
    } catch (error) {
      console.error('Erro ao escanear código de barras:', error);
      this.hasError = true;
    }
  }
}
