import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  imports: [
    IonicModule
  ],
  selector: 'app-services-initialization',
  templateUrl: './services-initialization.component.html',
  styleUrls: ['./services-initialization.component.scss'],
})
export class ServicesInitializationComponent implements OnInit {
  private isApiServiceInitialized = false;
  public title = 'Iniciando todos os serviços';
  public subTitle = 'Por favor, aguarde enquanto os serviços são inicializados.';
  public content = 'Carregando serviços...';

  constructor(
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    this.apiService.isBackgroundServiceInitialized.subscribe((isInitialized: boolean) => {
      this.isApiServiceInitialized = isInitialized;
    });

    await this.apiService.init().then(() => {
      setTimeout(async () => {
        if (!this.isApiServiceInitialized) {
          await this.apiService.connectBackgroundService();
          setTimeout(() => {
            // If the services are not initialized after 10 seconds, show an error message
            this.handleError();
          }, 10000);
        }
      }, 3000);
    });
  }

  private handleError() {
    this.title = 'Não foi possível iniciar os serviços';
    this.subTitle = 'Por favor, verifique a conexão dos dispositivos ou tente iniciá-los manualmente.';
    this.content = 'Erro ao carregar serviços';
  }
}
