import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TestsComponent } from '../tests/tests.component';

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
  public vp: string = '';
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
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

  constructor() { }

  ngOnInit() {}

  cancelTest() {}
}
