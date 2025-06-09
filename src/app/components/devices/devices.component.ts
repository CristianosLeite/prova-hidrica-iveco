import { Component, signal, WritableSignal, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Device } from 'src/app/types/device.type';
import { DeviceService } from 'src/app/services/device/device.service';
import { NgIf } from '@angular/common';

@Component({
  imports: [IonicModule, NgIf],
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  public phonePortraitOutline = 'phone-portrait-outline';
  public phonePortraitSharp = 'phone-portrait-sharp';
  public desktopOutline = 'desktop-outline';
  public desktopSharp = 'desktop-sharp';
  public batteryFullOutline = 'battery-full-outline';
  public batteryFullSharp = 'battery-full-sharp';
  public batteryHalfOutline = 'battery-half-outline';
  public batteryHalfSharp = 'battery-half-sharp';
  public batteryDeadOutline = 'battery-dead-outline';
  public batteryDeadSharp = 'battery-dead-sharp';
  public flashlightOutline = 'flash-outline';
  public flashlightSharp = 'flash-sharp';
  public wifiOutline = 'wifi-outline';
  public wifiSharp = 'wifi-sharp';
  public alertOutline = 'alert-outline';
  public alertSharp = 'alert-sharp';
  public addOutline = 'add-outline';
  public addSharp = 'add-sharp';

  public devices: WritableSignal<Device[]> = signal([]);

  constructor(
    private deviceService: DeviceService
  ) { }

  async ngOnInit() {
    await this.syncDeviceInfo();
    this.deviceService.connectedDevices.subscribe((devices) => {
      this.devices.set(devices);
    });
  }

  async syncDeviceInfo(): Promise<void> {
    const devices = await this.deviceService.syncDeviceInfo();
    this.devices.set(devices);
  }

  async handleRefresh(event: Event) {
    await this.deviceService.syncDeviceInfo().then(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }
}
