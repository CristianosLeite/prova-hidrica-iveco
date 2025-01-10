import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    IonicModule,
    FormsModule,
  ],
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.scss'],
})
export class DeviceConfigComponent  implements OnInit {
  public deviceId = '';

  constructor() { }

  async ngOnInit() {
    await Device.getId().then((deviceId) => {
      this.deviceId = deviceId.identifier;
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.deviceId);
  }
}
