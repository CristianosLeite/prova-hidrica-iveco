import { EventEmitter, Injectable, Output } from '@angular/core';
import { IMainApplication } from 'src/app/interfaces/IMainApplication.inteface';
import { InfiltrationPoints } from 'src/app/types/infiltrationPoints.type';

@Injectable({
  providedIn: 'root'
})
export class MainService implements IMainApplication {
  qtyTests: number = 5;
  qtyVerifications: number = 0;
  infiltrationPoints: InfiltrationPoints = {};

  @Output() qtyVerificationsChanged: EventEmitter<number> = new EventEmitter();

  constructor() { }

  start(): void {
    this.qtyVerificationsChanged.emit(this.qtyTests);
    this.infiltrationPoints = {};
    console.log('Service started');
  }

  stop(): void {
    console.log('Service stopped');
  }

  finish(): void {
    console.log('Service finished');
  }

  addInfiltrationPoint(key: number, value: boolean): void {
    this.infiltrationPoints[key] = value;
  }

  removeInfiltrationPoint(key: number): void {
    delete this.infiltrationPoints[key];
  }

  processVerification(infiltrationPoints: InfiltrationPoints): void {
    this.qtyVerifications++;
    Object.entries(infiltrationPoints).forEach(([key, value]) => {
      this.addInfiltrationPoint(Number(key), value || false);
    });
    console.log('Verification processed');
    console.log(this.infiltrationPoints);
    this.qtyVerificationsChanged.emit(this.qtyVerifications);
  }
}
