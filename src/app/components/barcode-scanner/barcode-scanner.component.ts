import { Component, Input, signal, WritableSignal } from '@angular/core';
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
export class BarcodeScannerComponent {
  @Input() context: Context | undefined;
  public title: WritableSignal<string> = signal('Aguardando leitura do VP');
  public subtitle: WritableSignal<string> = signal('Utilize o leitor de código de barras.');
  public content: WritableSignal<string> = signal('Aguardando leitura...');

  constructor(
    private apiService: ApiService,
    private mainService: MainService
  ) { }

  async scan() {
    ScannerPlugin.scanBarcode().then((result) => {
      this.apiService.sendBarcodeData(result.value).then((response: SocketResponse) => {
        this.mainService.setRecipe(response.payload.recipe);
        this.title.set('VP lido com sucesso');
        this.subtitle.set('Receita carregada!');
        this.content.set(response.payload.message);
      }).catch((error) => {
        console.error('Erro ao escanear código de barras:', error);
        this.title.set('Erro ao ler o código de barras.');
        this.subtitle.set(error.payload.message);
        this.content.set('');
      });
    });

    setTimeout(() => {
      this.title.set('Aguardando leitura do VP');
      this.subtitle.set('Utilize o leitor de código de barras.');
      this.content.set('Aguardando leitura...');
    }, 5000);
  }
}
