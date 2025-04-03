import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Context } from 'src/app/types/context.type';

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
  @Input() public context: Context = 'logout';
  constructor(private authService: AuthService) { }

  login() {
    if (this.context === 'logout')
      this.authService.authenticate();
  }
}
