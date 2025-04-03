export enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
  Error = 'error',
}

export enum Platform {
  Mobile = 'mobile',
  Desktop = 'desktop',
  None = 'none',
}

export enum BatteryStatus {
  Full = 'full',
  Half = 'half',
  Dead = 'dead',
}

export type Device = {
  deviceId: string;
  platform: Platform | string;
  networkStatus: DeviceStatus | string;
  batteryStatus: BatteryStatus | string;
  isCharging: boolean;
}
