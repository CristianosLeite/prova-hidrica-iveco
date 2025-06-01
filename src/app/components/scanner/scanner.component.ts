import { Component, OnInit, Input, signal, WritableSignal, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { Context } from 'src/app/types/context.type';
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
export class ScannerComponent implements OnInit, OnDestroy {
  @Input() context: Context | undefined;
  public qrTitle: WritableSignal<string> = signal('Aguardando leitura do QR Code');
  public qrSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public qrContent: WritableSignal<string> = signal('Aguardando leitura...');

  public vpTitle: WritableSignal<string> = signal('Aguardando leitura do VP');
  public vpSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public vpContent: WritableSignal<string> = signal('Aguardando leitura...');

  public cabinTitle: WritableSignal<string> = signal('Aguardando leitura do CHASSI ou CABINE');
  public cabinSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public cabinContent: WritableSignal<string> = signal('Aguardando leitura...');

  private vp: string = '';
  private cabin: string = '';
  private chassis: string = '';
  private barcodeInterval: ReturnType<typeof setTimeout> = setTimeout(() => '', 5000);

  constructor(
    private apiService: ApiService,
    private mainService: MainService,
    private router: Router
  ) { }

  ngOnInit() {
    this.barcodeInterval = setInterval(() => {
      this.readBarcode();
    }, 5000);
  }

  ngOnDestroy(): void {
    // Stop listening for barcode scans when the component is destroyed
    this.apiService.stopBarcodeReader();

    // Clear the interval to stop calling readBarcode
    if (this.barcodeInterval) {
      clearInterval(this.barcodeInterval);
    }
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

      if ((this.vp && this.chassis) || this.cabin) {
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
      typeData = 'CABIN';
      this.cabin = data;
      this.mainService.setCabin(this.cabin);
      this.updateUI('CABINE lido com sucesso', `cabin: ${this.cabin}`, '', 'CABIN');
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
        case 'CABIN':
          await this.scanCabin();
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
      if (result.value.length !== 14) {
        this.updateUI('Erro ao ler o VP', 'Código de barras inválido', '', 'VP');
        setTimeout(() => {
          this.resetUI('VP');
        }, 5000);
        return;
      }
      this.vp = result.value;
      this.updateUI('VP lido com sucesso', `VP: ${result.value}`, '', 'VP');
      if (this.vp !== '' && this.chassis !== '') await this.sendData('VP');
    });
  }

  private async scanCabin() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      if (result.value.length !== 8 && result.value.length !== 17) {
        this.updateUI('Erro ao ler o CHASSI ou CABINE', 'Código de barras inválido', '', 'CABIN');
        setTimeout(() => {
          this.resetUI('CABIN');
        }, 5000);
        return;
      }
      this.cabin = result.value;
      this.mainService.setCabin(result.value);
      this.updateUI('Cabine lida com sucesso', `CABINE: ${result.value}`, '', 'CABIN');
      if (this.cabin !== '') await this.sendData('CABIN');
    });
  }

  private async sendData(typeData: string) {
    const recipeKey = this.vp !== '' ? this.vp : this.cabin;
    await this.apiService.sendBarcodeData(recipeKey).then(async (result) => {
      this.mainService.setRecipe(result.payload.recipe);
      this.resetData();
    }).catch((error) => {
      this.updateUI('Erro ao carregar receita', error.payload.message, '', typeData);
      setTimeout(() => {
        this.resetUI(typeData);
      }, 5000);
    });
  }

  private resetData() {
    this.vp = '';
    this.chassis = '';
    this.cabin = '';
  }

  private updateUI(title: string, subtitle: string, content: string, typeData: string) {
    switch (typeData) {
      case 'VP':
        this.vpTitle.set(title);
        this.vpSubtitle.set(subtitle);
        this.vpContent.set(content);
        break;
      case 'CABIN':
        this.cabinTitle.set(title);
        this.cabinSubtitle.set(subtitle);
        this.cabinContent.set(content);
        break;
      case 'CHASSIS':
        this.cabinTitle.set(title);
        this.cabinSubtitle.set(subtitle);
        this.cabinContent.set(content);
        break;
      case 'QR':
        this.qrTitle.set(title);
        this.qrSubtitle.set(subtitle);
        this.qrContent.set(content);
        break;
      default:
        console.error('Tipo de leitura não reconhecido.');
        break;
    }
  }

  private resetUI(typeData: string) {
    switch (typeData) {
      case 'VP':
        this.vpTitle.set('Aguardando leitura do VP');
        this.vpSubtitle.set('Utilize o leitor de código de barras.');
        this.vpContent.set('Aguardando leitura...');
        break;
      case 'CABIN':
        this.cabinTitle.set('Aguardando leitura do CHASSI ou CABINE');
        this.cabinSubtitle.set('Utilize o leitor de código de barras.');
        this.cabinContent.set('Aguardando leitura...');
        break;
      case 'CHASSIS':
        this.cabinTitle.set('Aguardando leitura do CHASSI ou CABINE');
        this.cabinSubtitle.set('Utilize o leitor de código de barras.');
        this.cabinContent.set('Aguardando leitura...');
        break;
      case 'QR':
        this.qrTitle.set('Aguardando leitura do QR Code');
        this.qrSubtitle.set('Utilize o leitor de código de barras.');
        this.qrContent.set('Aguardando leitura...');
        break;
      default:
        console.error('Tipo de leitura não reconhecido.');
        break;
    }
  }
}
