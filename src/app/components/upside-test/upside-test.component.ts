import { Component, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MainService } from 'src/app/services/main/main.service';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-upside-test',
  templateUrl: './upside-test.component.html',
  styleUrls: ['./upside-test.component.scss'],
})
export class UpsideTestComponent  implements OnInit {
  public selected1: boolean = false;
  public selected2: boolean = false;
  public selected3: boolean = false;
  public selected4: boolean = false;
  public selected5: boolean = false;

  @Output() public testResult = {
    1: this.selected5,
    2: this.selected5,
    3: this.selected5,
    4: this.selected5,
    5: this.selected5
  };

  constructor(
    private mainService: MainService,
  ) { }

  ngOnInit() {}

  select(button: number) {
    switch (button) {
      case 0:
        this.selected1 = !this.selected1;
        this.testResult[1] = this.selected1;
        break;
      case 1:
        this.selected2 = !this.selected2;
        this.testResult[2] = this.selected2;
        break;
      case 2:
        this.selected3 = !this.selected3;
        this.testResult[3] = this.selected3;
        break;
      case 3:
        this.selected4 = !this.selected4;
        this.testResult[4] = this.selected4;
        break;
      case 4:
        this.selected5 = !this.selected5;
        this.testResult[5] = this.selected5;
        break;
    }
  }

  confirm() {
    this.mainService.processVerification(this.testResult);
  }
}
