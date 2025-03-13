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

  public cisTitle: WritableSignal<string> = signal('Aguardando leitura do CIS');
  public cisSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public cisContent: WritableSignal<string> = signal('Aguardando leitura...');

  private vp: string = '';
  private cis: string = '';

  constructor(
    private apiService: ApiService,
    private mainService: MainService,
    private router: Router
  ) { }

  async ngOnInit() {
    setInterval(() => {
      this.readBarcode();
    }, 5000);
  }

  private async readBarcode() {
    let typeData = '';
    try {
      await this.apiService.BarcodeReader().then(async (response: SocketResponse) => {
        if (! this.context && this.context !== 'search') {
          if (response.payload.data.RecipeId) {
            typeData = 'VP';
            this.vp = response.payload.data.Vp;
            this.updateUI('VP lido com sucesso', `VP: ${this.vp}`, '', 'VP');
          } else {
            typeData = 'cis';
            this.cis = response.payload.data;
            this.mainService.setCis(this.cis);
            this.updateUI('cis lido com sucesso', `cis: ${this.cis}`, '', 'cis');
          }
        } else {
          typeData = 'QR';
          this.updateUI('QR Code lido com sucesso', `ID: ${response.payload.data}`, '', 'QR');
          this.router.navigate(['/main/test-result'], { queryParams: { id: response.payload.data } });
          this.context = undefined;
        }

        if (this.vp !== '' && this.cis !== '') await this.sendData();
        else await this.apiService.BarcodeReader();
      });
    } catch (error: any) {
      console.error('Erro ao ler código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload.message, '', '');
      setTimeout(() => {
        this.resetUI(typeData);
      }, 5000);
    }
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
        case 'cis':
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
      if (this.vp !== '' && this.cis !== '') await this.sendData();
    });
  }

  private async scanCIS() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      this.cis = result.value;
      this.mainService.setCis(result.value);
      this.updateUI('cis lido com sucesso', `cis: ${result.value}`, '', 'cis');
      if (this.vp !== '' && this.cis !== '') await this.sendData();
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
    } else if (typeData === 'cis') {
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
