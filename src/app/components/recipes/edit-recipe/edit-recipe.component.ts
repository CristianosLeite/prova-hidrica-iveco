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
    this.recipeId = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {
    if (this.recipeId) {
      this.context = 'edit';
      this.recipeService.retrieveRecipeByVp(this.recipeId).then((recipe: Recipe) => {
        this.recipe = recipe;
      });
    }
  }

  async saveRecipe() {
    if (!this.recipe.description || !this.recipe.vp) {
      this.showAlert('Atenção!', 'Campos obrigatórios não preenchidos.', 'Por favor, preencha os campos obrigatórios.');
      return;
    }
    if (!this.recipe.sprinkler_height) {
      this.showAlert('Atenção!', 'Campo obrigatório não preenchido.', 'Por favor, selecione a altura dos asperssores.');
      return;
    }
    this.recipeId ? await this.updateRecipe() : await this.createRecipe();
  }

  private async createRecipe() {
    this.recipe.createdBy = this.authService.getLoggedUser().Id!;
    await this.recipeService.createRecipe(this.recipe).then(() => {
      this.recipeService.retrieveAllRecipes();
      this.router.navigate(['/main/recipes']);
    }).catch((error) => {
      this.showAlert('Erro!', 'Erro ao criar receita.', error.message);
    });
  }

  private async updateRecipe() {
    await this.recipeService.updateRecipe(this.recipe).then(() => {
      this.router.navigate(['/main/recipes']);
    });
  }

  async deleteRecipe() {
    if (!this.recipe.recipe_id) return;
    await this.recipeService.deleteRecipe(this.recipe.recipe_id);
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
