import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/types/user.type';

@Component({
  imports: [
    IonicModule
  ],
  selector: 'app-unauthenticated-user',
  templateUrl: './unauthenticated-user.component.html',
  styleUrls: ['./unauthenticated-user.component.scss'],
})
export class UnauthenticatedUserComponent {
  @Input() public logo = '';
  @Input() public user: User = {} as User;
  constructor(
    private authService: AuthService
  ) { }

  login() {
    this.authService.authenticate();
  }
}
