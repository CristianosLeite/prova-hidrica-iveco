import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InfiltrationPointsComponent } from '../infiltration-points/infiltration-points.component';
import { MainService } from 'src/app/services/main/main.service';
import { Recipe } from 'src/app/types/recipe.type';
import { BarcodeScannerComponent } from '../barcode-scanner/barcode-scanner.component';
import { LoadedRecipeModalComponent } from "../loaded-recipe-modal/loaded-recipe-modal.component";
import { Operation } from 'src/app/types/operation.type';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  imports: [
    IonicModule,
    FormsModule,
    InfiltrationPointsComponent,
    BarcodeScannerComponent,
    LoadedRecipeModalComponent
],
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss'],
})
export class RunComponent  implements OnInit {
  public recipe: Recipe = {} as Recipe;
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

  private operation: Operation = {} as Operation;

  constructor(
    private mainService: MainService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.mainService.qtyVerificationsChanged.subscribe((qty: number) => {
      this.qtyVerifications = qty;
    });
    this.mainService.recipeChanged.subscribe((recipe: Recipe) => {
      this.recipe = recipe;
      this.operation.Recipe = this.recipe.RecipeId!;
      this.operation.Vp = this.recipe.Vp;
    });
    this.operation.Operator = this.authService.getLoggedUser().BadgeNumber;
  }

  finishTest() {
    if (this.qtyVerifications < this.qtyTests) {
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
    this.mainService.finish(this.operation);
  }

  cancelTest() {
    this.mainService.cancelTest();
  }
}
