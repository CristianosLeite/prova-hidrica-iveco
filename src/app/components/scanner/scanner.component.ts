import { Component, OnInit, Input, signal, WritableSignal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Context } from 'src/app/types/context.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { ScannerPlugin } from 'q2i-scanner-plugin';
import { MainService } from 'src/app/services/main/main.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
  @Input() context: Context | undefined;
  public qrTitle: WritableSignal<string> = signal('Aguardando leitura do QR Code');
  public qrSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public qrContent: WritableSignal<string> = signal('Aguardando leitura...');

  public vpTitle: WritableSignal<string> = signal('Aguardando leitura do VP');
  public vpSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public vpContent: WritableSignal<string> = signal('Aguardando leitura...');

  public cisTitle: WritableSignal<string> = signal('Aguardando leitura do CHASSI ou CIS');
  public cisSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public cisContent: WritableSignal<string> = signal('Aguardando leitura...');

  private vp: string = '';
  private cis: string = '';
  private chassis: string = '';

  constructor(
    private apiService: ApiService,
    private mainService: MainService,
    private router: Router
  ) { }

  ngOnInit() {
    setInterval(async () => {
      await this.readBarcode();
    }, 5000);
  }

  private async readBarcode() {
    let typeData = '';
    try {
      const response = await this.apiService.BarcodeReader();
      const data = response.payload.data;

      if (!this.context || this.context !== 'search') {
        typeData = this.processBarcodeData(data);
      } else {
        this.handleQrCode(data);
        return;
      }

      if ((this.vp && this.chassis) || this.cis) {
        await this.sendData(typeData);
      } else {
        await this.apiService.BarcodeReader();
      }
    } catch (error: any) {
      this.handleBarcodeError(error, typeData);
    }
  }

  private handleQrCode(data: any) {
    this.updateUI('QR Code lido com sucesso', `ID: ${data}`, '', 'QR');
    this.router.navigate(['/main/test-result'], { queryParams: { id: data } });
    this.context = undefined;
  }

  private processBarcodeData(data: any): string {
    let typeData = '';
    if (data.RecipeId || data.length === 14) {
      typeData = 'VP';
      this.vp = data.Vp || data;
      this.updateUI('VP lido com sucesso', `VP: ${this.vp}`, '', 'VP');
      this.updateUI('Aguardando leitura do CHASSI', 'Utilize o leitor de código de barras.', 'Aguardando leitura...', 'CHASSIS');
    } else if (data.length === 8) {
      typeData = 'CIS';
      this.cis = data;
      this.mainService.setCis(this.cis);
      this.updateUI('CIS lido com sucesso', `cis: ${this.cis}`, '', 'CIS');
    } else if (data.length === 17) {
      typeData = 'CHASSIS';
      this.chassis = data;
      this.mainService.setChassis(this.chassis);
      this.updateUI('Chassi lido com sucesso', `Chassi: ${this.chassis}`, '', 'CHASSIS');
    }
    return typeData;
  }

  private handleBarcodeError(error: any, typeData: string) {
    console.error('Erro ao ler código de barras:', error);
    this.updateUI('Erro ao ler o código de barras.', error.payload?.message || 'Erro desconhecido', '', '');
    setTimeout(() => {
      this.resetUI(typeData);
    }, 5000);
  }

  async scan(typeData: string) {
    try {
      switch (typeData) {
        case 'QR':
          await this.scanQR();
          break;
        case 'VP':
          await this.scanVP();
          break;
        case 'CIS':
          await this.scanCIS();
          break;
        default:
          console.error('Tipo de leitura não reconhecido.');
      }
    } catch (error: any) {
      console.error('Erro ao escanear código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload.message, '', typeData);
      setTimeout(() => {
        this.resetUI(typeData);
      }, 5000);
    }
  }

  private async scanQR() {
    await ScannerPlugin.scanBarcode().then((result) => {
      this.updateUI('QR Code lido com sucesso', `ID: ${result.value}`, '', 'QR');
      this.router.navigate(['/main/test-result'], { queryParams: { id: result.value } });
      this.context = undefined;
      return result;
    });
  }

  private async scanVP() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      this.vp = result.value;
      this.updateUI('VP lido com sucesso', `VP: ${result.value}`, '', 'VP');
      if (this.vp !== '' && this.chassis !== '') await this.sendData('VP');
    });
  }

  private async scanCIS() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      this.cis = result.value;
      this.mainService.setCis(result.value);
      this.updateUI('cis lido com sucesso', `CIS: ${result.value}`, '', 'CIS');
      if (this.cis !== '') await this.sendData('CIS');
    });
  }

  private async sendData(typeData: string) {
    const recipeKey = this.vp ?? this.cis;
    console.log('Sending barcode data:', recipeKey);
    await this.apiService.sendBarcodeData(recipeKey).then(async (result) => {
      this.mainService.setRecipe(result.payload.recipe);
      this.resetData();
    }).catch((error) => {
      console.error('Erro ao enviar código de barras:', error);
      this.updateUI('Erro ao carregar receita', error.payload.message, '', typeData);
      setTimeout(() => {
        this.resetUI(typeData);
      }, 5000);
    });
  }

  private resetData() {
    this.vp = '';
    this.chassis = '';
    this.cis = '';
  }

  private updateUI(title: string, subtitle: string, content: string, typeData: string) {
    if (typeData === 'VP') {
      this.vpTitle.set(title);
      this.vpSubtitle.set(subtitle);
      this.vpContent.set(content);
    } else if (typeData === 'CIS') {
      this.cisTitle.set(title);
      this.cisSubtitle.set(subtitle);
      this.cisContent.set(content);
    } else if (typeData === 'CHASSIS') {
      this.cisTitle.set(title);
      this.cisSubtitle.set(subtitle);
      this.cisContent.set(content);
    } else if (typeData === 'QR') {
      this.qrTitle.set(title);
      this.qrSubtitle.set(subtitle);
      this.qrContent.set(content);
    }
  }

  private resetUI(typeData: string) {
    this.updateUI('Aguardando leitura do VP', 'Utilize o leitor de código de barras.', 'Aguardando leitura...', typeData);
  }
}
