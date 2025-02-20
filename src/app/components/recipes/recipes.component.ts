import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ListRecipesComponent } from "./list-recipes/list-recipes.component";

@Component({
  imports: [
    IonicModule,
    RouterLink,
    ListRecipesComponent
],
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent  implements OnInit {
  public documentOutline = 'document-outline';
  public documentSharp = 'document-sharp';
  public addOutline = 'add-outline';
  public addSharp = 'add-sharp';

  constructor() { }

  ngOnInit() {}

}
