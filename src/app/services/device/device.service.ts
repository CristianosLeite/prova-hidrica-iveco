import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { Device } from 'src/app/types/device.type';
import { Device as Dv } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnInit {

  private syncInterval: any;
  @Output() public connectedDevices: EventEmitter<Device[]> = new EventEmitter();

  constructor(
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    this.syncDeviceInfo();
  }

  private async getDeviceInfo(): Promise<Device> {
    const id = await Dv.getId();
    const info = await Dv.getInfo();
    const batteryInfo = await Dv.getBatteryInfo();
    const networkStatus = await Network.getStatus();

    console.log(networkStatus);

    return {
      deviceId: id.identifier || 'unknown',
      type: info.operatingSystem === 'ios' ||
        info.operatingSystem === 'android' ?
        'mobile' :
        'desktop',
      networkStatus: networkStatus.connected ? 'online' : 'offline',
      batteryStatus: batteryInfo.batteryLevel
        ? batteryInfo.batteryLevel > 0.5
          ? 'full'
          : 'half'
        : 'dead',
      isCharging: batteryInfo.isCharging || false,
    };
  }

  async syncDeviceInfo(): Promise<Device[]> {
    const device = await this.getDeviceInfo();
    const devices = (await this.apiService.sendDeviceData(device)).payload.devices;
    this.connectedDevices.emit(devices);
    return devices;
  }

  public startDeviceSync() {
    this.syncInterval = setInterval(async () => {
      await this.syncDeviceInfo();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}
