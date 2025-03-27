export enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
  Error = 'error',
}

export enum DeviceType {
  Mobile = 'mobile',
  Desktop = 'desktop',
}

export enum BatteryStatus {
  Full = 'full',
  Half = 'half',
  Dead = 'dead',
}

export type Device = {
  deviceId: string;
  deviceName: string;
  type: DeviceType | string;
  networkStatus: DeviceStatus | string;
  batteryStatus: BatteryStatus | string;
  isCharging: boolean;
  createdAt: Date;
  updatedAt: Date;
}
