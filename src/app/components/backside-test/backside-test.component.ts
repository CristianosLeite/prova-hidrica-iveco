import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-backside-test',
  templateUrl: './backside-test.component.html',
  styleUrls: ['./backside-test.component.scss'],
})
export class BacksideTestComponent  implements OnInit {
  public selected18: boolean = false;
  public selected19: boolean = false;
  public selected20: boolean = false;
  public selected21: boolean = false;

  constructor() { }

  ngOnInit() {}

  select(button: number) {
    switch (button) {
      case 0:
        this.selected18 = !this.selected18;
        break;
      case 1:
        this.selected19 = !this.selected19;
        break;
      case 2:
        this.selected20 = !this.selected20;
        break;
      case 3:
        this.selected21 = !this.selected21;
        break;
    }
  }

  finishTest() {}
}
