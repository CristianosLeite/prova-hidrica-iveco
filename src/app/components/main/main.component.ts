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
import { RunComponent } from '../run/run.component';
import { FrontsideTestComponent } from '../frontside-test/frontside-test.component';
import { UpsideTestComponent } from '../upside-test/upside-test.component';
import { BacksideTestComponent } from '../backside-test/backside-test.component';
import { LeftsideTestComponent } from '../leftside-test/leftside-test.component';
import { RightsideTestComponent } from '../rightside-test/rightside-test.component';
import { TestsComponent } from '../tests/tests.component';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    RunComponent,
    UserComponent,
    EditUserComponent,
    SettingsComponent,
    ServerComponent,
    PreferencesComponent,
    BarcodeScannerComponent,
    DevicesComponent,
    DeviceConfigComponent,
    TestsComponent,
    UpsideTestComponent,
    FrontsideTestComponent,
    BacksideTestComponent,
    LeftsideTestComponent,
    RightsideTestComponent,
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
