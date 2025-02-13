import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SettingsService } from './services/settings/settings.service';
import { ApiService } from './services/api/api.service';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
  ],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private isDark = false;
  public logo = 'assets/img/conecsa-light.webp';

  public appPages = [
    { title: 'Iniciar', url: '/main/run', icon: 'play' },
    { title: 'Registros', url: '/main/records', icon: 'server' },
    { title: 'Usuários', url: '/main/users', icon: 'people' },
    { title: 'Dispositivos', url: '/main/devices', icon: 'phone-portrait' },
    { title: 'Leitor de código', url: '/main/barcode-scanner', icon: 'barcode' },
    { title: 'Configurações', url: '/main/settings', icon: 'settings' },
  ];
  public labels = ['28/12/2024 00:43:00 - Concluído', '28/12/2024 00:43:00 - Concluído', '28/12/2024 00:43:00 - Concluído', '28/12/2024 00:43:00 - Concluído', '28/12/2024 00:43:00 - Concluído', '28/12/2024 00:43:00 - Concluído'];

  constructor(
    private settingsService: SettingsService,
    private apiService: ApiService,
  ) {
    this.apiService.init();
  }

  async ngOnInit() {
    this.settingsService.themeChanged.subscribe((isDark: boolean) => {
      this.isDark = isDark;
      this.setDarkModeLogo(this.isDark);
    });
  }

  setDarkModeLogo(isDark: boolean) {
    this.isDark = isDark;
    this.logo = this.isDark ? 'assets/img/conecsa.webp' : 'assets/img/conecsa-light.webp';
  }
}
