import { Injectable } from '@angular/core';
import { Device } from 'src/app/types/device.type';
import { Device as Dv } from '@capacitor/device';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() { }

  async getDeviceInfo(): Promise<Device> {
    const id = await Dv.getId();
    const info = await Dv.getInfo();
    const batteryInfo = await Dv.getBatteryInfo();
    const networkStatus = await Network.getStatus();

    return {
      deviceId: id.identifier || 'unknown',
      deviceName: info.name || 'unknown',
      type: info.model || 'unknown',
      networkStatus: networkStatus.connected ? 'online' : 'offline',
      batteryStatus: batteryInfo.batteryLevel
        ? batteryInfo.batteryLevel > 0.5
          ? 'full'
          : 'half'
        : 'dead',
      isCharging: batteryInfo.isCharging || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
