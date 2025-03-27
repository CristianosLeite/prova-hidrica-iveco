import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ListRecipesComponent } from "./list-recipes/list-recipes.component";
import { AuthService } from 'src/app/services/auth/auth.service';

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
export class RecipesComponent {
  public documentOutline = 'document-outline';
  public documentSharp = 'document-sharp';
  public addOutline = 'add-outline';
  public addSharp = 'add-sharp';

  public userHasPermission = false;

  constructor(auth: AuthService) {
    this.userHasPermission = auth.hasPermission('WR')
  }
}
