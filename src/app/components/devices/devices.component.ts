import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Device } from 'src/app/types/device.type';

@Component({
  imports: [
    IonicModule,
    NgIf,
  ],
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent  implements OnInit {
  public dataSource: { devices: Device[] } = { devices: [] };
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

  constructor() { }

  ngOnInit() {
    this.dataSource.devices = [
      {
        deviceId: '1',
        deviceName: 'Desktop',
        type: 'desktop',
        networkStatus: 'offline',
        batteryStatus: 'full',
        isCharging: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        deviceId: '2',
        deviceName: 'Palmer1',
        type: 'palmer',
        networkStatus: 'online',
        batteryStatus: 'half',
        isCharging: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        deviceId: '3',
        deviceName: 'Palmer2',
        type: 'palmer',
        networkStatus: 'error',
        batteryStatus: 'dead',
        isCharging: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  handleRefresh(e: Event) { }
}
