import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/types/recipe.type';
import { Context } from 'src/app/types/context.type';

@Component({
  imports: [
    IonicModule,
    FormsModule
  ],
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent  implements OnInit {
  public recipeId: string = '';
  public recipe: Recipe = {} as Recipe;
  public saveOutline = 'save-outline';
  public saveSharp = 'save-sharp';
  public trashOutline = 'trash-outline';
  public trashSharp = 'trash-sharp';
  public alertButtons = [
    {
      text: 'Excluir',
      role: 'confirm',
      handler: () => {
        this.deleteRecipe();
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
  ];
  public context: Context = 'create';
  public alertHeader: string | undefined = undefined;
  public alertSubHeader: string | undefined = undefined;
  public alertMessage: string | undefined = undefined;

  constructor() { }

  ngOnInit() {}

  deleteRecipe() {
    console.log('Recipe deleted');
  }

  saveRecipe() {
    console.log('Recipe saved');
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caractéres restantes`;
  }
}
