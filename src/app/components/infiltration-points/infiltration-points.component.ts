import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainService } from 'src/app/services/main/main.service';
import { InfiltrationTest } from 'src/app/types/infiltrationTest.type';

@Component({
  imports: [
    IonicModule,
    RouterLink,
  ],
  selector: 'app-infiltration-points',
  templateUrl: './infiltration-points.component.html',
  styleUrls: ['./infiltration-points.component.scss'],
})
export class InfiltrationPointsComponent implements OnInit {
  public tests: WritableSignal<InfiltrationTest[]> = signal([]);

  constructor(
    private mainService: MainService
  ) { }

  async ngOnInit() {
    await this.mainService.initializeTests();
    this.tests.set(this.mainService.tests());
  }
}
