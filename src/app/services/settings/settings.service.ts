import { EventEmitter, Injectable, Output } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  /**
   * @description Emit event when theme is changed.
   * True for dark mode, false for light mode
   */
  @Output() themeChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {
    this.init();
  }

  private async init() {
    this.storageService.storageCreated.subscribe(async () => {
      const theme = await this.storageService.get('darkMode') || false;
      if (theme !== null && theme !== undefined) {
        this.themeChanged.emit(theme);
      }
      this.updateThemeMode(theme);
    });
  }

  /**
   * @description Set the theme mode
   * @param isDark boolean
   */
  updateThemeMode(theme: boolean) {
    if (theme) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }

  /**
   * @description Save the preferences for dark mode and notifications
   * @param darkMode boolean
   * @param notifications boolean
   */
  async savePreferences(darkMode: boolean, notifications: boolean) {
    await this.storageService.set('darkMode', darkMode);
    await this.storageService.set('notifications', notifications);
    this.themeChanged.emit(darkMode);
  }

  /**
   * @description Load the preferences for dark mode and notifications
   * @returns Promise<{ darkMode: boolean, notifications: boolean }>
    */
  async loadPreferences() {
    const darkMode = await this.storageService.get('darkMode');
    const notifications = await this.storageService.get('notifications');
    return { darkMode, notifications };
  }

  async updateServer(protocol: string, host: string, port: string) {
    await this.storageService.set('serverProtocol', protocol);
    await this.storageService.set('serverIp', host);
    await this.storageService.set('serverPort', port);
  }

  async loadServer() {
    const protocol = await this.storageService.get('serverProtocol');
    const host = await this.storageService.get('serverIp');
    const port = await this.storageService.get('serverPort');
    return { protocol, host, port };
  }

  async reloadApp() {
    // Show the splash for two seconds and then automatically hide it:
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }
}
