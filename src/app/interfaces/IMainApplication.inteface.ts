import { EventEmitter } from '@angular/core';

export type StopOptions = 'cancel' | 'finish';

export interface IMainApplication {
  qtyVerificationsChanged: EventEmitter<number>;
  start(): void;
  stop(option: StopOptions): void;
}
