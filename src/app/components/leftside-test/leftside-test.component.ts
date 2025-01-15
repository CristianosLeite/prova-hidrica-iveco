import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-leftside-test',
  templateUrl: './leftside-test.component.html',
  styleUrls: ['./leftside-test.component.scss'],
})
export class LeftsideTestComponent  implements OnInit {
  public selected6: boolean = false;
  public selected7: boolean = false;
  public selected8: boolean = false;
  public selected9: boolean = false;
  public selected10: boolean = false;
  public selected11: boolean = false;

  constructor() { }

  ngOnInit() {}

  select(button: number) {
    switch (button) {
      case 0:
        this.selected6 = !this.selected6;
        break;
      case 1:
        this.selected7 = !this.selected7;
        break;
      case 2:
        this.selected8 = !this.selected8;
        break;
      case 3:
        this.selected9 = !this.selected9;
        break;
      case 4:
        this.selected10 = !this.selected10;
        break;
      case 5:
        this.selected11 = !this.selected11;
        break;
    }
  }

  finishTest() {}
}
