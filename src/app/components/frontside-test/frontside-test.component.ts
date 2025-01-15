import { Component, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-frontside-test',
  templateUrl: './frontside-test.component.html',
  styleUrls: ['./frontside-test.component.scss'],
})
export class FrontsideTestComponent implements OnInit {
  public selected22: boolean = false;
  public selected23: boolean = false;
  public selected24: boolean = false;
  public selected25: boolean = false;
  public selected26: boolean = false;
  public selected27: boolean = false;

  public selected28: boolean = false;
  public selected29: boolean = false;
  public selected30: boolean = false;
  public selected31: boolean = false;
  public selected32: boolean = false;
  public selected33: boolean = false;

  @Output() public testResult = {
    22: this.selected22,
    23: this.selected23,
    24: this.selected24,
    25: this.selected25,
    26: this.selected26,
    27: this.selected27,
    28: this.selected28,
    29: this.selected29,
    30: this.selected30,
    31: this.selected31,
    32: this.selected32,
    33: this.selected33
  };

  constructor() { }

  ngOnInit() { }

  select(button: number) {
    switch (button) {
      case 0:
        this.selected22 = !this.selected22;
        break;
      case 1:
        this.selected23 = !this.selected23;
        break;
      case 2:
        this.selected24 = !this.selected24;
        break;
      case 3:
        this.selected25 = !this.selected25;
        break;
      case 4:
        this.selected26 = !this.selected26;
        break;
      case 5:
        this.selected27 = !this.selected27;
        break;
      case 6:
        this.selected28 = !this.selected28;
        break;
      case 7:
        this.selected29 = !this.selected29;
        break;
      case 8:
        this.selected30 = !this.selected30;
        break;
      case 9:
        this.selected31 = !this.selected31;
        break;
      case 10:
        this.selected32 = !this.selected32;
        break;
      case 11:
        this.selected33 = !this.selected33;
        break;
    }
  }

  finishTest() {

  }
}
