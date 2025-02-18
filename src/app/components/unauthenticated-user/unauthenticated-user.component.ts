import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  constructor(
    private authService: AuthService
  ) { }

  login() {
    this.authService.authenticate();
  }
}
