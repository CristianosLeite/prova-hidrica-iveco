import { ApiService } from './../../../services/api/api.service';
import { NgStyle } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainService } from 'src/app/services/main/main.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { InfiltrationTest } from 'src/app/types/infiltrationTest.type';

interface InfiltrationPoint {
  id: number;
  position: { top: string, left: string };
}

@Component({
  imports: [
    IonicModule,
    NgStyle
  ],
  selector: 'app-point-selection',
  templateUrl: './point-selection.component.html',
  styleUrls: ['./point-selection.component.scss'],
})
export class PointSelectionComponent implements OnInit {
  @Input() testId!: string;
  @Input() testPoints!: InfiltrationPoint[];
  @Input() testTitle!: string;

  public testResult: { [key: number]: boolean } = {};
  public selectedSignals: { [key: number]: any } = {};

  public test: InfiltrationTest = {} as InfiltrationTest;

  constructor(
    private mainService: MainService,
    private storage: StorageService,
    private apiService: ApiService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.testPoints.forEach(point => {
      this.testResult[point.id] = false;
      this.selectedSignals[point.id] = signal(false);
    });

    const foundTest = this.mainService.tests().find(t => t.id === this.testId);
    if (foundTest) {
      this.test = foundTest;
    } else {
      throw new Error(`Test with id ${this.testId} not found`);
    }

    try {
      await this.storage.get(this.testId).then((test) => {
        if (test) {
          for (const key in test.testResult) {
            this.testResult[key as unknown as keyof typeof this.testResult] = test.testResult[key];
          }
          this.testPoints.forEach(point => {
            this.selectedSignals[point.id].set(this.testResult[point.id]);
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  select(button: number) {
    this.selectedSignals[button].set(!this.selectedSignals[button]());
    this.testResult[button] = this.selectedSignals[button]();
  }

  async confirm() {
    this.test.status = 'completed';
    this.test.testResult = this.testResult;
    await this.apiService.verficationCompleted(this.test).then(() => {
      this.router.navigate(['main/run']);
    });
  }
}
