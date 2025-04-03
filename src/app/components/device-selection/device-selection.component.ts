import { Component, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Platform } from 'src/app/types/device.type';

@Component({
  imports: [
    IonicModule
  ],
  selector: 'app-device-selection',
  templateUrl: './device-selection.component.html',
  styleUrls: ['./device-selection.component.scss'],
})
export class DeviceSelectionComponent {
  @Output() deviceSelected = new EventEmitter<Platform>();

  selectDevice(device: string) {
    switch (device) {
      case 'desktop':
        this.deviceSelected.emit(Platform.Desktop);
        break;
      case 'mobile':
        this.deviceSelected.emit(Platform.Mobile);
        break;
      default:
        this.deviceSelected.emit(Platform.None);
        break;
    }
  }
}
