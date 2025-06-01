import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/types/recipe.type';
import { Context } from 'src/app/types/context.type';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController } from '@ionic/angular';

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
  public recipeId: number = 0;
  public recipeKey = '';
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
  public alertHandler = () => {
    this.hasError = false;
  };
  public context: Context = 'create';
  public alertHeader: string | undefined = undefined;
  public alertSubHeader: string | undefined = undefined;
  public alertMessage: string | undefined = undefined;
  public hasError = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.recipeId = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
  }

  ngOnInit() {
    if (this.recipeId) {
      this.context = 'edit';
      this.recipeService.retrieveRecipeById(this.recipeId).then((recipe: Recipe) => {
        this.recipe = recipe;
        this.recipeKey = recipe.Vp ? recipe.Vp : recipe.Cabin ? recipe.Cabin : '';
      });
    }
  }

  async saveRecipe() {
    this.setCabinOrVp();
    if (!this.recipe.Description || (!this.recipe.Vp && !this.recipe.Cabin)) {
      this.showAlert('Atenção!', 'Campos obrigatórios não preenchidos.', 'Por favor, preencha os campos obrigatórios.');
      return;
    }
    if (!this.recipe.SprinklerHeight) {
      this.showAlert('Atenção!', 'Campo obrigatório não preenchido.', 'Por favor, selecione a altura dos asperssores.');
      return;
    }
    this.recipeId ? await this.updateRecipe() : await this.createRecipe();
  }

  private async createRecipe() {
    this.recipe.CreatedBy = this.authService.getLoggedUser().BadgeNumber!;
    await this.recipeService.createRecipe(this.recipe).then(() => {
      this.recipeService.retrieveAllRecipes();
      this.router.navigate(['/main/recipes']);
    }).catch((error) => {
      this.showAlert('Erro!', 'Erro ao criar receita.', error.message);
    });
  }

  private setCabinOrVp() {
    if (this.recipeKey.length === 8) {
      this.recipe.Cabin = this.recipeKey;
    } else {
      this.recipe.Vp = this.recipeKey;
    }
  }

  private async updateRecipe() {
    await this.recipeService.updateRecipe(this.recipe).then(() => {
      this.router.navigate(['/main/recipes']);
    });
  }

  async deleteRecipe() {
    if (!this.recipe.RecipeId) return;
    await this.recipeService.deleteRecipe(this.recipe.RecipeId);
    this.recipeService.retrieveAllRecipes();
  }

  private async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caractéres restantes`;
  }
}
