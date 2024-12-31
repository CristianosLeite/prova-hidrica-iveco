import { Injectable, Output, EventEmitter } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user.type';
import { IUserService } from '../../interfaces/IUserService.interface';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {
  @Output() usersChanged: EventEmitter<User[]> = new EventEmitter();
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private baseUrl = '';

  constructor(
    private storageService: StorageService,
    private http: HttpClient
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

  async createUser(user: User): Promise<User> {
    return await lastValueFrom(this.http.post<User>(`${this.baseUrl}/create`, user));
  }

  async retrieveUser(id: string): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<User>(`${this.baseUrl}/one?user_id=${id}`));
    });
    return data;
  }

  async retrieveAllUsers(): Promise<User[]> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<User[]>(`${this.baseUrl}/all`));
    });
    this.usersChanged.emit(data);
    return data;
  }

  async getUserByBadgeNumber(badgeNumber: number): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.get<User>(`${this.baseUrl}/one?badge_number=${badgeNumber}`));
    });
    return data;
  }

  async updateUser(user: User): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.put<User>(`${this.baseUrl}/update`, user));
    });
    return data;
  }

  async deleteUser(id: string): Promise<User> {
    const data = await this.init().then(async () => {
      return await lastValueFrom(this.http.delete<User>(`${this.baseUrl}/delete?user_id=${id}`));
    });
    return data;
  }
}
