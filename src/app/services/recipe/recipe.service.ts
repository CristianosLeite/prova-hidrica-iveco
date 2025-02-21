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

  async retrieveRecipeByVp(vp: string): Promise<Recipe> {
    const data = await lastValueFrom(this.http.get<Recipe>(`${this.baseUrl}/one?recipe_vp=${vp}`, { headers: this.headers }));
    this.recipeChanged.emit(data);
    return data;
  }

  async createRecipe(recipe: Recipe): Promise<Recipe> {
    return await lastValueFrom(this.http.post<Recipe>(`${this.baseUrl}/create`, { heders: this.headers, body: recipe }));
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    return await lastValueFrom(this.http.put<Recipe>(`${this.baseUrl}/update`, { headers: this.headers, body: recipe }));
  }

  async deleteRecipe(id: number): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.baseUrl}/delete?recipe_id=${id}`, { headers: this.headers }));
    this.router.navigate(['/recipes']);
  }
}
