import { Injectable, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/types/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() public userAuthenticated = new EventEmitter<User>();
  @Output() public authenticationChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() public isAuthenticating: EventEmitter<boolean> = new EventEmitter();
  private loggedUser: User = {} as User;

  constructor() { }

  public authenticate() {
    this.isAuthenticating.emit(true);
  }

  setLoggedUser(user: User) {
    this.loggedUser = user;
    this.userAuthenticated.emit(user);
    this.authenticationChanged.emit(true);
    this.isAuthenticating.emit(false);
  }

  hasPermission(permission: string): boolean {
    return this.loggedUser.Permissions.includes(permission);
  }

  getLoggedUser(): User {
    return this.loggedUser;
  }
}
