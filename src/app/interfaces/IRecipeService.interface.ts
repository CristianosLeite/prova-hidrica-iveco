import { Recipe } from "../types/recipe.type";

export interface IRecipeService {
  retrieveAllRecipes(): Promise<Recipe[]>;
  retrieveRecipeById(id: string): Promise<Recipe>;
  createRecipe(recipe: Recipe): Promise<void>;
  updateRecipe(recipe: Recipe): Promise<void>;
  deleteRecipe(id: string): Promise<void>;
}
