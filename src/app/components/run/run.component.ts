import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TestsComponent } from '../tests/tests.component';
import { MainService } from 'src/app/services/main/main.service';

@Component({
  imports: [
    IonicModule,
    FormsModule,
    TestsComponent,
  ],
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss'],
})
export class RunComponent  implements OnInit {
  public vp: string = '12345678901234';
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
  public qtyVerifications: number = 0;
  public qtyTests: number = 5;

  public alertButtons = [
    {
      text: 'Sim',
      role: 'confirm',
      handler: () => {
        this.cancelTest();
      },
    },
    {
      text: 'Não',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
  ];

  constructor(
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.mainService.qtyVerificationsChanged.subscribe((qty: number) => {
      this.qtyVerifications = qty;
    });
  }

  cancelTest() {}
}
