import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-rightside-test',
  templateUrl: './rightside-test.component.html',
  styleUrls: ['./rightside-test.component.scss'],
})
export class RightsideTestComponent  implements OnInit {
  public selected12: boolean = false;
  public selected13: boolean = false;
  public selected14: boolean = false;
  public selected15: boolean = false;
  public selected16: boolean = false;
  public selected17: boolean = false;

  constructor() { }

  ngOnInit() {}

  select(button: number) {
    switch (button) {
      case 0:
        this.selected12 = !this.selected12;
        break;
      case 1:
        this.selected13 = !this.selected13;
        break;
      case 2:
        this.selected14 = !this.selected14;
        break;
      case 3:
        this.selected15 = !this.selected15;
        break;
      case 4:
        this.selected16 = !this.selected16;
        break;
      case 5:
        this.selected17 = !this.selected17;
        break;
    }
  }

  finishTest() {}
}
