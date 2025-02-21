import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/types/recipe.type';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { RefresherEventDetail, IonRefresherCustomEvent } from '@ionic/core';

@Component({
  imports: [
    IonicModule,
    FormsModule,
    RouterLink
  ],
  selector: 'app-list-recipes',
  templateUrl: './list-recipes.component.html',
  styleUrls: ['./list-recipes.component.scss'],
})
export class ListRecipesComponent implements OnInit {
  public documentOutline = 'document-outline';
  public documentSharp = 'document-sharp';
  public dataSource: { recipes: Recipe[] } = { recipes: [] };
  public searchTerm: string = '';
  public hasError = false;
  public errorMessage = '';

  constructor(
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.recipeService.retrieveAllRecipes().catch((error: Error) => {
      this.hasError = true;
      this.errorMessage = error.message;
    });
    this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.dataSource.recipes = recipes;
    });
  }

  search(e: Event) {
    this.recipeService.retrieveAllRecipes().then((recipes: Recipe[]) => {
      this.dataSource.recipes = recipes.filter((recipe) => {
        return recipe.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          recipe.vp.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    });
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      this.recipeService.retrieveAllRecipes().then((recipes: Recipe[]) => {
        this.dataSource.recipes = recipes;
      }).then(() => {
        event.target.complete();
      });
    }, 2000);
  }
}
