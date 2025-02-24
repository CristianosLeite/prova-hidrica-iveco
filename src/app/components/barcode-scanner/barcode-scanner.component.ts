import { Component, OnInit, Input, signal, WritableSignal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Context } from 'src/app/types/context.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { ScannerPlugin } from 'q2i-scanner-plugin';
import { MainService } from 'src/app/services/main/main.service';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit {
  @Input() context: Context | undefined;
  public title: WritableSignal<string> = signal('Aguardando leitura do VP');
  public subtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public content: WritableSignal<string> = signal('Aguardando leitura...');

  constructor(
    private apiService: ApiService,
    private mainService: MainService
  ) { }

  ngOnInit() {
    setInterval(() => {
      this.readBarcode();
    }, 5000);
  }

  private async readBarcode() {
    try {
      const response: SocketResponse = await this.apiService.BarcodeReader();
      this.updateUI('VP lido com sucesso', 'Receita carregada!', response.payload.message);
    } catch (error: any) {
      console.error('Erro ao escanear código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload.message, '');
      setTimeout(() => {
        this.resetUI();
      }, 5000);
    }
  }

  async scan() {
    try {
      const result = await ScannerPlugin.scanBarcode();
      const response: SocketResponse = await this.apiService.sendBarcodeData(result.value);
      this.mainService.setRecipe(response.payload.recipe);
      this.updateUI('VP lido com sucesso', 'Receita carregada!', response.payload.message);
    } catch (error: any) {
      console.error('Erro ao escanear código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload.message, '');
      setTimeout(() => {
        this.resetUI();
      }, 5000);
    }
  }

  private updateUI(title: string, subtitle: string, content: string) {
    this.title.set(title);
    this.subtitle.set(subtitle);
    this.content.set(content);
  }

  private resetUI() {
    this.updateUI('Aguardando leitura do VP', 'Utilize o leitor de código de barras.', 'Aguardando leitura...');
  }
}
