import { Component, OnInit, signal, HostListener, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService } from './services/storage/storage.service';
import { SettingsService } from './services/settings/settings.service';
import { ApiService } from './services/api/api.service';
import { UnauthenticatedUserComponent } from './components/unauthenticated-user/unauthenticated-user.component';
import { RfidComponent } from './components/rfid/rfid.component';
import { AuthService } from './services/auth/auth.service';
import { ServicesInitializationComponent } from "./components/services-initialization/services-initialization.component";
import { OperationService } from './services/operation/operation.service';
import { DeviceService } from './services/device/device.service';
import { Context } from './types/context.type';

declare type LastOperations = {
  id: string;
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
  private isDark = false;
  public context: WritableSignal<Context> = signal('login');
  public logo = 'assets/img/conecsa-light.webp';
  public isUserAuthenticated = false;
  public isAuthenticating = false;
  public isApiServiceInitialized = false;
  public isBackgroundServiceRunning = false;
  public isMobile = false;
  public showMobileContent = true;

  public appPages = [
    { title: 'Iniciar', url: '/main/run', icon: 'play', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Registros', url: '/main/records', icon: 'server', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Usuários', url: '/main/users', icon: 'people', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Receitas', url: '/main/recipes', icon: 'cube', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Dispositivos', url: '/main/devices', icon: 'phone-portrait', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Configurações', url: '/main/settings', icon: 'settings', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Buscar', url: '/main/search', icon: 'qr-code', action: (value: boolean) => this.hideMobileContent(value) },
    { title: 'Sair', url: '', icon: 'log-out', action: (value: boolean) => { this.logout(); this.hideMobileContent(value) } },
  ];

  public lastOperations = signal([] as LastOperations[]);

  constructor(
    private storageService: StorageService,
    private settingsService: SettingsService,
    private apiService: ApiService,
    private authService: AuthService,
    private operationService: OperationService,
    private router: Router,
    private deviceService: DeviceService
  ) { }

  ngOnInit() {
    this.checkScreenSize();
    this.storageService.storageCreated.subscribe(async () => {
      this.updateLastOperations();
    });
    this.settingsService.themeChanged.subscribe((isDark: boolean) => {
      this.isDark = isDark;
      this.setDarkModeLogo(this.isDark);
    });
    this.authService.isAuthenticating.subscribe((isAuthenticating: boolean) => {
      this.isAuthenticating = isAuthenticating;
      isAuthenticating ? this.context.set('login') : this.context.set('logout');
    });
    this.authService.authenticationChanged.subscribe((isAuthenticated: boolean) => {
      this.isUserAuthenticated = isAuthenticated;
    });
    this.authService.authContextChanged.subscribe((context: Context) => {
      this.context.set(context);
    });
    this.apiService.isApiConnected.subscribe((isConnected: boolean) => {
      this.isApiServiceInitialized = isConnected;
      this.apiService.listenAuthentication(false);
      this.apiService.listenUnAuthentication(false).then(() => {
        this.authService.logOut();
      });
    });
    this.apiService.isBackgroundServiceInitialized.subscribe((isInitialized: boolean) => {
      this.isBackgroundServiceRunning = isInitialized;
    });
    this.operationService.operationCreated.subscribe(() => {
      this.updateLastOperations();
    });

    this.deviceService.startDeviceSync();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  async updateLastOperations(amount: number = 6) {
    await this.operationService.retrieveLastOperationsByAmount(amount).then((operations) => {
      this.lastOperations.set(operations.map((operation) => {
        return {
          id: operation.OperationId!,
          vp: operation.Vp,
          dateTime: new Date(operation.StartTime).toLocaleString(),
        };
      }));
    });
  }

  setDarkModeLogo(isDark: boolean) {
    this.isDark = isDark;
    this.logo = this.isDark ? 'assets/img/conecsa.webp' : 'assets/img/conecsa-light.webp';
  }

  hideMobileContent(value: boolean) {
    this.showMobileContent = value;
  }

  openOperation(operationId: string) {
    this.router.navigate(['/main/test-result'], { queryParams: { id: operationId } });
  }

  async logout() {
    this.authService.logOut();
    await this.apiService.listenUnAuthentication();
  }
}
