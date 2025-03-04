import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService } from './services/storage/storage.service';
import { SettingsService } from './services/settings/settings.service';
import { ApiService } from './services/api/api.service';
import { UnauthenticatedUserComponent } from './components/unauthenticated-user/unauthenticated-user.component';
import { RfidComponent } from './components/rfid/rfid.component';
import { AuthService } from './services/auth/auth.service';
import { ServicesInitializationComponent } from "./components/services-initialization/services-initialization.component";
import { OperationService } from './services/operation/operation.service';

declare type LastOperations = {
  vp: string;
  dateTime: string;
};

@Component({
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    UnauthenticatedUserComponent,
    RfidComponent,
    ServicesInitializationComponent
  ],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public logo = 'assets/img/conecsa-light.webp';
  public isUserAuthenticated = false;
  public isAuthenticating = false;
  public isApiServiceInitialized = false;
  public isBackgroundServiceRunning = false;
  private isDark = false;

  public appPages = [
    { title: 'Iniciar', url: '/main/run', icon: 'play' },
    { title: 'Registros', url: '/main/records', icon: 'server' },
    { title: 'Usuários', url: '/main/users', icon: 'people' },
    { title: 'Receitas', url: '/main/recipes', icon: 'cube' },
    { title: 'Dispositivos', url: '/main/devices', icon: 'phone-portrait' },
    { title: 'Configurações', url: '/main/settings', icon: 'settings' },
  ];

  public lastOperations = signal([] as LastOperations[]);

  constructor(
    private storageService: StorageService,
    private settingsService: SettingsService,
    private apiService: ApiService,
    private authService: AuthService,
    private operationService: OperationService
  ) { }

  ngOnInit() {
    this.storageService.storageCreated.subscribe(async () => {
      this.updateLastOperations();
    });
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
    this.apiService.isApiConnected.subscribe((isConnected: boolean) => {
      this.isApiServiceInitialized = isConnected;
    });
    this.apiService.isBackgroundServiceInitialized.subscribe((isInitialized: boolean) => {
      this.isBackgroundServiceRunning = isInitialized;
    });
    this.operationService.operationCreated.subscribe(() => {
      this.updateLastOperations();
    });
  }

  async updateLastOperations(amount: number = 6) {
    await this.operationService.retrieveLastOperationsByAmount(amount).then((operations) => {
      this.lastOperations.set(operations.map((operation) => {
        return {
          vp: operation.Vp,
          dateTime: new Date(operation.CreatedAt).toLocaleString(),
        };
      }));
    });
  }

  setDarkModeLogo(isDark: boolean) {
    this.isDark = isDark;
    this.logo = this.isDark ? 'assets/img/conecsa.webp' : 'assets/img/conecsa-light.webp';
  }
}
