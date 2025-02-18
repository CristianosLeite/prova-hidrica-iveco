import { Injectable, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/types/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() public userAuthenticated = new EventEmitter<User>();
  @Output() public authenticationChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() public isAuthenticating: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  public authenticate() {
    this.isAuthenticating.emit(true);
  }
}
