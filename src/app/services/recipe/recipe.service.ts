import { lastValueFrom } from 'rxjs';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { IRecipeService } from 'src/app/interfaces/IRecipeService.interface';
import { Recipe } from 'src/app/types/recipe.type';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RecipeService implements IRecipeService {
  @Output() recipesChanged: EventEmitter<Recipe[]> = new EventEmitter();
  @Output() recipeChanged: EventEmitter<Recipe> = new EventEmitter();
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private baseUrl = '';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private router: Router
  ) {
    this.storageService.storageCreated.subscribe(async () => {
      this.init();
    });
  }

  private async init(): Promise<void> {
    this.protocol = await this.storageService.get('serverProtocol');
    this.serverIp = await this.storageService.get('serverIp');
    this.serverPort = await this.storageService.get('serverPort');
    this.baseUrl = `${this.protocol}://${this.serverIp}:${this.serverPort}/api/recipes`;
  }

  async retrieveAllRecipes(): Promise<Recipe[]> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<Recipe[]>(`${this.baseUrl}/all`, { headers: this.headers }));
    });
    this.recipesChanged.emit(data);
    return data;
  }

  async retriveBetweenRecipes(start: number, end: number): Promise<Recipe[]> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<Recipe[]>(`${this.baseUrl}/between?start=${start}&end=${end}`, { headers: this.headers }));
    });
    this.recipesChanged.emit(data);
    return data;
  }

  async retrieveRecipeByVp(vp: string): Promise<Recipe> {
    const data = await lastValueFrom(this.http.get<Recipe>(`${this.baseUrl}/one?vp=${vp}`, { headers: this.headers }));
    this.recipeChanged.emit(data);
    return data;
  }

  async createRecipe(recipe: Recipe): Promise<Recipe> {
    if (!recipe.CreatedBy) {
      throw new Error('Recipe must have a createdBy field');
    }

    return await this.init().then(async () => {
      return await lastValueFrom(this.http.post<Recipe>(`${this.baseUrl}/create`, recipe, { headers: this.headers }));
    });
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    return await this.init().then(async () => {
      return await lastValueFrom(this.http.put<Recipe>(`${this.baseUrl}/update`, recipe, { headers: this.headers}));
    });
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.init().then(async () => {
      await lastValueFrom(this.http.delete(`${this.baseUrl}/delete?recipe_id=${id}`, { headers: this.headers }));
    this.router.navigate(['/recipes']);
    });
  }
}
