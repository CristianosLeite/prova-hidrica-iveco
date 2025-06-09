import { Component, OnInit, signal, HostListener, WritableSignal, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  key: string;
  dateTime: string;
};

@Component({
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    UnauthenticatedUserComponent,
    RfidComponent,
    ServicesInitializationComponent,
    RouterLinkActive
  ],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
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
    { title: 'Iniciar', url: '/main/run', icon: 'play', action: () => this.handleMenuAction('/main/run') },
    { title: 'Registros', url: '/main/records', icon: 'server', action: () => this.handleMenuAction('/main/records') },
    { title: 'Usuários', url: '/main/users', icon: 'people', action: () => this.handleMenuAction('/main/users') },
    { title: 'Receitas', url: '/main/recipes', icon: 'cube', action: () => this.handleMenuAction('/main/recipes') },
    { title: 'Dispositivos', url: '/main/devices', icon: 'phone-portrait', action: () => this.handleMenuAction('/main/devices') },
    { title: 'Configurações', url: '/main/settings', icon: 'settings', action: () => this.handleMenuAction('/main/settings') },
    { title: 'Buscar', url: '/main/search', icon: 'qr-code', action: () => this.handleMenuAction('/main/search') },
    { title: 'Sair', url: '', icon: 'log-out', action: async () => { this.handleMenuAction(''); await this.logout(); } },
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
      await this.updateLastOperations();
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
      this.apiService.listenUnAuthentication(false).then(async () => {
        await this.logout().then(() => {
          window.location.reload();
        });
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

  ngAfterViewInit() {
    // Give the view a moment to render
    setTimeout(() => {
      const routerOutlet = document.querySelector('ion-router-outlet#main-content');
      if (routerOutlet) {
        // Create a mutation observer to detect when aria-hidden is added
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
              // Remove the aria-hidden attribute when detected
              routerOutlet.removeAttribute('aria-hidden');
            }
          });
        });

        // Start observing the router outlet for attribute changes
        observer.observe(routerOutlet, { attributes: true });

        // Initial cleanup
        routerOutlet.removeAttribute('aria-hidden');
      }
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.checkScreenSize();
  }

  handleMenuAction(url: string) {
    if (this.isMobile) {
      this.showMobileContent = false;

      if (url) this.router.navigate([url]);
    }
  }

  // Add a method to handle back navigation in mobile view
  backToMobileMenu() {
    this.showMobileContent = true;
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  async updateLastOperations(amount: number = 6) {
    await this.operationService.retrieveLastOperationsByAmount(amount).then((operations) => {
      this.lastOperations.set(operations.map((operation) => {
        return {
          id: operation.OperationId!,
          key: operation.Vp || operation.Cabin,
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
    await this.apiService.listenUnAuthentication().then(() => {
      this.authService.logOut();
    });
  }
}
