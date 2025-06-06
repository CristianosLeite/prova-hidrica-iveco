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

  public vpTitle: WritableSignal<string> = signal('Aguardando leitura do VP ou CABINE');
  public vpSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public vpContent: WritableSignal<string> = signal('Aguardando leitura...');

  public cabinTitle: WritableSignal<string> = signal('Aguardando leitura do CHASSI ou CIS');
  public cabinSubtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public cabinContent: WritableSignal<string> = signal('Aguardando leitura...');
  public isFirstScanComplete: boolean = false;
  public testType: 'truck' | 'cabin' | null = null;

  private vp: string = '';
  private cabin: string = '';
  private chassis: string = '';
  private cis: string = '';
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

      // Verificação adaptada para incluir o CIS
      const isComplete =
        (this.testType === 'truck' && this.vp && this.chassis && this.vp !== this.chassis) ||
        (this.testType === 'cabin' && this.cabin && this.cis && this.cabin !== this.cis);

      if (isComplete) {
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

    // Se for a primeira leitura, precisamos determinar o tipo de teste (caminhão ou cabine)
    if (!this.isFirstScanComplete) {
      if (data.RecipeId || data.length === 14) {
        // Caso seja leitura de VP - Tipo 1 (caminhão)
        typeData = 'VP';
        this.testType = 'truck';
        this.vp = data.Vp || data;
        this.updateUI('VP lido com sucesso', `VP: ${this.vp}`, '', 'VP');
        this.updateUI('Aguardando leitura do CHASSI', 'Utilize o leitor de código de barras.', 'Aguardando leitura...', 'CHASSIS');
        this.isFirstScanComplete = true;
      } else if (data.length === 8) {
        // Caso seja leitura de CABINE - Tipo 2 (cabine)
        typeData = 'CABIN';
        this.testType = 'cabin';
        this.cabin = data.Cabin || data;
        this.mainService.setCabin(this.cabin);
        this.updateUI('CABINE lido com sucesso', `cabin: ${this.cabin}`, '', 'CABIN');
        this.updateUI('Aguardando leitura do CIS', 'Utilize o leitor de código de barras.', 'Aguardando leitura...', 'CIS');
        this.isFirstScanComplete = true;
      }
    }
    // Segunda leitura, já sabemos qual o tipo de teste
    else {
      if (this.testType === 'truck' && data.length === 17) {
        // Segunda leitura para Tipo 1 (caminhão) - Chassi
        typeData = 'CHASSIS';
        this.chassis = data;
        this.mainService.setChassis(this.chassis);
        this.updateUI('Chassi lido com sucesso', `Chassi: ${this.chassis}`, '', 'CHASSIS');
      } else if (this.testType === 'cabin' && data.length === 8) {
        // Segunda leitura para Tipo 2 (cabine) - CIS
        typeData = 'CIS';
        this.cis = data;
        this.mainService.setCis(this.cis);
        this.updateUI('CIS lido com sucesso', `CIS: ${this.cis}`, '', 'CIS');
      } else {
        // Leitura inválida para o tipo de teste atual
        this.updateUI('Código de barras inválido', 'O formato não corresponde ao esperado.', '', this.testType === 'truck' ? 'CHASSIS' : 'CIS');
        return '';
      }
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
        case 'CHASSIS':
          await this.scanChassis();
          break;
        case 'CIS':
          await this.scanCis();
          break;
        default:
          console.error('Tipo de leitura não reconhecido.');
      }
    } catch (error: any) {
      console.error('Erro ao escanear código de barras:', error);
      this.updateUI('Erro ao ler o código de barras.', error.payload?.message || 'Erro desconhecido', '', typeData);
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
      if (result.value.length !== 8) {
        this.updateUI('Erro ao ler a CABINE', 'Código de barras inválido', '', 'CABIN');
        setTimeout(() => {
          this.resetUI('CABIN');
        }, 5000);
        return;
      }

      // Se for a primeira leitura, trata como CABINE
      if (!this.isFirstScanComplete) {
        this.cabin = result.value;
        this.mainService.setCabin(result.value);
        this.testType = 'cabin';
        this.updateUI('CABINE lida com sucesso', `CABINE: ${result.value}`, '', 'CABIN');
        this.updateUI('Aguardando leitura do CIS', 'Utilize o leitor de código de barras.', 'Aguardando leitura...', 'CIS');
        this.isFirstScanComplete = true;
      }
    });
  }

  private async scanChassis() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      if (result.value.length !== 17) {
        this.updateUI('Erro ao ler o CHASSI', 'Código de barras inválido', '', 'CHASSIS');
        setTimeout(() => {
          this.resetUI('CHASSIS');
        }, 5000);
        return;
      }
      this.chassis = result.value;
      this.mainService.setChassis(result.value);
      this.updateUI('CHASSI lido com sucesso', `CHASSI: ${result.value}`, '', 'CHASSIS');
      if (this.vp !== '' && this.chassis !== '') await this.sendData('CHASSIS');
    });
  }

  private async scanCis() {
    await ScannerPlugin.scanBarcode().then(async (result) => {
      if (result.value.length !== 8) {
        this.updateUI('Erro ao ler o CIS', 'Código de barras inválido', '', 'CIS');
        setTimeout(() => {
          this.resetUI('CIS');
        }, 5000);
        return;
      }
      this.cis = result.value;
      this.mainService.setCis(result.value);
      this.updateUI('CIS lido com sucesso', `CIS: ${result.value}`, '', 'CIS');
      if (this.cabin !== '' && this.cis !== '') await this.sendData('CIS');
    });
  }

  private async sendData(typeData: string) {
    // Verificação adicional para garantir que todos os dados necessários estão presentes
    if (this.testType === 'truck' && (!this.vp || !this.chassis)) {
      this.updateUI('Dados incompletos', 'É necessário ler o VP e o CHASSI', '', typeData);
      return;
    }

    if (this.testType === 'cabin' && (!this.cabin || !this.cis)) {
      this.updateUI('Dados incompletos', 'É necessário ler a CABINE e o CIS', '', typeData);
      return;
    }

    // Determina qual chave usar para a receita
    const recipeKey = this.testType === 'truck' ? this.vp : this.cabin;

    await this.apiService.sendBarcodeData(recipeKey).then(async (result) => {
      this.mainService.setRecipe(result.payload.recipe);
      this.resetData();
    }).catch((error) => {
      this.updateUI('Erro ao carregar receita', error.payload?.message || 'Erro desconhecido', '', typeData);
      setTimeout(() => {
        this.resetUI(typeData);
        this.resetData();
      }, 5000);
    });
  }

  private resetData() {
    this.vp = '';
    this.chassis = '';
    this.cabin = '';
    this.cis = '';
    this.testType = null;
    this.isFirstScanComplete = false;
  }

  private updateUI(title: string, subtitle: string, content: string, typeData: string) {
    switch (typeData) {
      case 'VP':
        this.vpTitle.set(title);
        this.vpSubtitle.set(subtitle);
        this.vpContent.set(content);
        break;
      case 'CABIN':
        this.vpTitle.set(title);
        this.vpSubtitle.set(subtitle);
        this.vpContent.set(content);
        break;
      case 'CHASSIS':
        this.cabinTitle.set(title);
        this.cabinSubtitle.set(subtitle);
        this.cabinContent.set(content);
        break;
      case 'CIS':
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
        this.vpTitle.set('Aguardando leitura da CABINE');
        this.vpSubtitle.set('Utilize o leitor de código de barras.');
        this.vpContent.set('Aguardando leitura...');
        break;
      case 'CHASSIS':
        this.cabinTitle.set('Aguardando leitura do CHASSI');
        this.cabinSubtitle.set('Utilize o leitor de código de barras.');
        this.cabinContent.set('Aguardando leitura...');
        break;
      case 'CIS':
        this.cabinTitle.set('Aguardando leitura do CIS');
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
