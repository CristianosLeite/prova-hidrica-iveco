import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ListDeviceComponent } from "./list-device/list-device.component";

@Component({
  imports: [
    IonicModule,
    RouterLink,
    ListDeviceComponent
],
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent {
  public phonePortraitOutline = 'phone-portrait-outline';
  public phonePortraitSharp = 'phone-portrait-sharp';
  public addOutline = 'add-outline';
  public addSharp = 'add-sharp';

  public userHasPermission = false;

  constructor(
    auth: AuthService
  ) {
    this.userHasPermission = auth.hasPermission('MS');
  }
}
