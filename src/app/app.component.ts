import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SettingsService } from './services/settings/settings.service';
import { ApiService } from './services/api/api.service';
import { UnauthenticatedUserComponent } from './components/unauthenticated-user/unauthenticated-user.component';
import { RfidComponent } from './components/rfid/rfid.component';
import { AuthService } from './services/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    UnauthenticatedUserComponent,
    RfidComponent
  ],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public logo = 'assets/img/conecsa-light.webp';
  public isUserAuthenticated = false;
  public isAuthenticating = false;
  private isDark = false;

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
    private authService: AuthService
  ) {
    this.apiService.init();
  }

  async ngOnInit() {
    this.settingsService.themeChanged.subscribe((isDark: boolean) => {
      this.isDark = isDark;
      this.setDarkModeLogo(this.isDark);
    });
    this.authService.isAuthenticating.subscribe((isAuthenticating: boolean) => {
      this.isAuthenticating = isAuthenticating;
    });
    this.authService.authenticationChanged.subscribe((isAuthenticated: boolean) => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  setDarkModeLogo(isDark: boolean) {
    this.isDark = isDark;
    this.logo = this.isDark ? 'assets/img/conecsa.webp' : 'assets/img/conecsa-light.webp';
  }
}
