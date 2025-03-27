import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  imports: [
    IonicModule,
    RouterLink,
    ListUsersComponent,
  ],
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  public personAddOutline = 'person-add-outline';
  public personAddSharp = 'person-add-sharp';
  public addOutline = 'add-outline';
  public addSharp = 'add-sharp';

  public userHasPermission = false;

  constructor(auth: AuthService) {
    this.userHasPermission = auth.hasPermission('WU')
  }
}
