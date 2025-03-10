import { Injectable, Output, EventEmitter } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../types/user.type';
import { IUserService } from '../../interfaces/IUserService.interface';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {
  @Output() usersChanged: EventEmitter<User[]> = new EventEmitter();
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private baseUrl = '';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

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
    this.baseUrl = `${this.protocol}://${this.serverIp}:${this.serverPort}/api/users`;
  }

  createUser(user: User): void {
    // return await lastValueFrom(this.http.post<User>(`${this.baseUrl}/create`, { heders: this.headers, body: user }));

    // User must be send to the background service to get the badge number.
    this.apiService.createUser(user).then((response) => {
      if (response.type === 'success') {
        this.retrieveAllUsers().then(() => this.router.navigate(['main/users']))

      } else {
        console.error('Error creating user:', response.payload.message);
      }
    });
  }

  async retrieveUserById(id: string): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<User>(`${this.baseUrl}/id?user_id=${id}`, { headers: this.headers }));
    });
    return data;
  }

  async retrieveAllUsers(): Promise<User[]> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<User[]>(`${this.baseUrl}/all`, { headers: this.headers }));
    });
    this.usersChanged.emit(data);
    return data;
  }

  async getUserByBadgeNumber(badgeNumber: string): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<User>(`${this.baseUrl}/badge?badge_number=${badgeNumber}`, { headers: this.headers }));
    });
    return data;
  }

  async updateUser(user: User): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.put<User>(`${this.baseUrl}/update?user_id=${user.Id}`, user, { headers: this.headers }));
    });
    return data;
  }

  async deleteUser(id: string): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.delete<User>(`${this.baseUrl}/delete?user_id=${id}`, { headers: this.headers }));
    });
    return data;
  }
}
