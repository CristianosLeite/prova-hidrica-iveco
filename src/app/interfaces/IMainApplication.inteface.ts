import { EventEmitter } from '@angular/core';
import { Operation } from "../types/operation.type"

export interface IMainApplication {
  qtyVerificationsChanged: EventEmitter<number>;

  start(): void;
  stop(): void;
  finish(operation: Operation): void;
}
