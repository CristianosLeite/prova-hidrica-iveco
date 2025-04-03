import { Injectable, Output, EventEmitter } from '@angular/core';
import { Context } from 'src/app/types/context.type';
import { User } from 'src/app/types/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() public userAuthenticated = new EventEmitter<User>();
  @Output() public authenticationChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() public isAuthenticating: EventEmitter<boolean> = new EventEmitter();
  @Output() public authContextChanged: EventEmitter<Context> = new EventEmitter();

  private loggedUser: User = {} as User;

  public authenticate() {
    this.isAuthenticating.emit(true);
    this.authContextChanged.emit('login');
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

  public logOut() {
    this.loggedUser = {} as User;
    this.authContextChanged.emit('logout');
    this.isAuthenticating.emit(false);
    this.userAuthenticated.emit(this.loggedUser);
    this.authenticationChanged.emit(false);
  }
}
