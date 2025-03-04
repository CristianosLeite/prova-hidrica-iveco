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
  public vpTitle: WritableSignal<string> = signal('Aguardando leitura do VP');
  public vpSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public vpContent: WritableSignal<string> = signal('Aguardando leitura...');

  public vanTitle: WritableSignal<string> = signal('Aguardando leitura do VAN');
  public vanSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public vanContent: WritableSignal<string> = signal('Aguardando leitura...');

  private vp: string = '';
  private van: string = '';

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
      this.updateUI('VP lido com sucesso', 'Receita carregada!', response.payload.message, 'VP');
    } catch (error: any) {
      console.error('Erro ao escanear código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload.message, '', 'VP');
      setTimeout(() => {
        this.resetUI('VP');
      }, 5000);
    }
  }

  async scan(typeData: string) {
    try {
      if (typeData === 'VP') {
        await this.scanVP();
      } else if (typeData === 'VAN') {
        await this.scanVAN();
      }
    } catch (error: any) {
      console.error('Erro ao escanear código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload.message, '', typeData);
      setTimeout(() => {
        this.resetUI(typeData);
      }, 5000);
    }
  }

  private async scanVP() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      this.vp = result.value;
      this.updateUI('VP lido com sucesso', `VP: ${result.value}`, '', 'VP');
      if (this.vp !== '' && this.van !== '') await this.sendData();
    });
  }

  private async scanVAN() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      this.van = result.value;
      this.mainService.setVan(result.value);
      this.updateUI('VAN lido com sucesso', `VAN: ${result.value}`, '', 'VAN');
      if (this.vp !== '' && this.van !== '') await this.sendData();
    });
  }

  private async sendData() {
    await this.apiService.sendBarcodeData(this.vp).then(async (result) => {
      this.mainService.setRecipe(result.payload.recipe);
    });
  }

  private updateUI(title: string, subtitle: string, content: string, typeData: string) {
    if (typeData === 'VP') {
      this.vpTitle.set(title);
      this.vpSubtitle.set(subtitle);
      this.vpContent.set(content);
    } else if (typeData === 'VAN') {
      this.vanTitle.set(title);
      this.vanSubtitle.set(subtitle);
      this.vanContent.set(content);
    }
  }

  private resetUI(typeData: string) {
    this.updateUI('Aguardando leitura do VP', 'Utilize o leitor de código de barras.', 'Aguardando leitura...', typeData);
  }
}
