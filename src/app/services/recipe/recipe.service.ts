import { Injectable, Output, EventEmitter } from '@angular/core';
import { IRecipeService } from 'src/app/interfaces/IRecipeService.interface';
import { Recipe } from 'src/app/types/recipe.type';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RecipeService implements IRecipeService {
  @Output() recipesChanged: EventEmitter<Recipe[]> = new EventEmitter();
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private baseUrl = '';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  private recipes: Recipe[] = [];

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private apiService: ApiService,
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

  retrieveAllRecipes(): Promise<Recipe[]> {
    throw new Error('Method not implemented.');
  }
  retrieveRecipeById(id: string): Promise<Recipe> {
    throw new Error('Method not implemented.');
  }
  createRecipe(recipe: Recipe): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateRecipe(recipe: Recipe): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteRecipe(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
