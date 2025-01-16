import { EventEmitter } from '@angular/core';
import { InfiltrationPoints } from "../types/infiltrationPoints.type"

export interface IMainApplication {
  qtyTests: number;
  qtyVerificationsChanged: EventEmitter<number>;
  infiltrationPoints: InfiltrationPoints;

  start(): void;
  stop(): void;
  finish(): void;
}
