import { Recipe } from "../types/recipe.type";

export interface IRecipeService {
  retrieveAllRecipes(): Promise<Recipe[]>;
  retrieveRecipeByVp(vp: string): Promise<Recipe>;
  createRecipe(recipe: Recipe): Promise<Recipe>;
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
}
