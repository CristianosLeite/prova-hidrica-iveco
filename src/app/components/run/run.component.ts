import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InfiltrationPointsComponent } from '../infiltration-points/infiltration-points.component';
import { MainService } from 'src/app/services/main/main.service';
import { CodebarComponent } from '../codebar/codebar.component';
import { Recipe } from 'src/app/types/recipe.type';

@Component({
  imports: [
    IonicModule,
    FormsModule,
    InfiltrationPointsComponent,
    CodebarComponent
  ],
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss'],
})
export class RunComponent  implements OnInit {
  public vp: string | null = null;
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
  public qtyVerifications: number = 0;
  public qtyTests: number = this.mainService.qtyTests;

  public progress = 0;
  public buffer = 0.06;
  public isLoading = false;

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
    private mainService: MainService
  ) { }

  ngOnInit() {
    this.mainService.qtyVerificationsChanged.subscribe((qty: number) => {
      this.qtyVerifications = qty;
    });
    this.mainService.recipeChanged.subscribe((recipe: Recipe) => {
      this.vp = recipe.vp;
      console.log('Recipe changed', recipe);
    });
  }

  finishTest() {
    if (this.qtyVerifications < this.qtyTests) {
      // this.mainService.finish();
      return;
    }
    setInterval(() => {
      this.progress += 0.01;

      // Reset the progress bar when it reaches 100%
      // to continuously show the demo
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);

    this.isLoading = true;
    this.mainService.finish();
  }

  cancelTest() {
    this.mainService.cancelTest();
  }
}
