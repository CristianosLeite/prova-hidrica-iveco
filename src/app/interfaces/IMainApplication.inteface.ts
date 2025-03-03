import { EventEmitter } from '@angular/core';
import { InfiltrationPoints } from "../types/infiltrationPoints.type"
import { Operation } from "../types/operation.type"

export interface IMainApplication {
  qtyTests: number;
  qtyVerificationsChanged: EventEmitter<number>;
  infiltrationPoints: InfiltrationPoints;

  start(): void;
  stop(): void;
  finish(operation: Operation): void;
}
