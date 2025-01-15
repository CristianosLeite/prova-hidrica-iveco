import { Component, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-upside-test',
  templateUrl: './upside-test.component.html',
  styleUrls: ['./upside-test.component.scss'],
})
export class UpsideTestComponent  implements OnInit {
  public selected0: boolean = false;
  public selected1: boolean = false;
  public selected2: boolean = false;
  public selected3: boolean = false;
  public selected4: boolean = false;

  @Output() public testResult = {
    0: this.selected0,
    1: this.selected1,
    2: this.selected2,
    3: this.selected3,
    4: this.selected4
  };

  constructor() { }

  ngOnInit() {}

  select(button: number) {
    switch (button) {
      case 0:
        this.selected0 = !this.selected0;
        break;
      case 1:
        this.selected1 = !this.selected1;
        break;
      case 2:
        this.selected2 = !this.selected2;
        break;
      case 3:
        this.selected3 = !this.selected3;
        break;
      case 4:
        this.selected4 = !this.selected4;
        break;
    }
  }

  finishTest() {

  }
}
