import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserComponent } from '../user/user.component';
import { EditUserComponent } from '../user/edit-user/edit-user.component';
import { SettingsComponent } from '../settings/settings.component';
import { ServerComponent } from '../settings/server/server.component';
import { PreferencesComponent } from '../settings/preferences/preferences.component';
import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';
import { DevicesComponent } from '../devices/devices.component';
import { DeviceConfigComponent } from '../settings/device-config/device-config.component';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    UserComponent,
    EditUserComponent,
    SettingsComponent,
    ServerComponent,
    PreferencesComponent,
    BarcodeScannerComponent,
    DevicesComponent,
    DeviceConfigComponent,
],
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public page!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.page = this.activatedRoute.snapshot.paramMap.get('page') as string;
  }
}
