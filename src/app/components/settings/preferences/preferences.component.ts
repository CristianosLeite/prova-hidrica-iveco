import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  imports: [
    IonicModule,
    FormsModule,
  ],
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent implements OnInit {
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
  public darkMode = false;
  public notifications = false;

  constructor(
    private settingsService: SettingsService,
  ) { }

  async ngOnInit() {
    this.loadPreferences();
  }

  async savePreferences() {
    await this.settingsService.savePreferences(this.darkMode, this.notifications);
  }

  async loadPreferences() {
    const preferences = await this.settingsService.loadPreferences();
    this.darkMode = preferences.darkMode;
    this.notifications = preferences.notifications;
  }

  setTheme() {
    this.settingsService.updateThemeMode(this.darkMode);
    this.savePreferences();
  }
}
