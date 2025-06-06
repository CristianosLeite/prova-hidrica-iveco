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
  public dataSource: { recipes: Recipe[] } = { recipes: [] };
  public searchTerm: string = '';
  public hasError = false;
  public errorMessage = '';
  public currentPage = 1;
  public itemsPerPage = 5;
  public paginatedRecipes: Recipe[] = [];

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
      this.updatePaginatedRecipes();
    });
  }

  updatePaginatedRecipes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRecipes = this.dataSource.recipes.slice(startIndex, endIndex);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.dataSource.recipes.length) {
      this.currentPage++;
      this.updatePaginatedRecipes();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedRecipes();
    }
  }

  search(e: Event) {
    this.recipeService.retrieveAllRecipes().then((recipes: Recipe[]) => {
      this.dataSource.recipes = recipes.filter((recipe) => {
        return recipe.Description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          recipe.Vp.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          recipe.Cabin.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      this.updatePaginatedRecipes();
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

  handleSprinklerHeight(height: number): string {
    return height === 1 ? 'Alta' : height === 2 ? 'Média' : 'Baixa';
  }
}
