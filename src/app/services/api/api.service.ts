import { InfiltrationTest } from './../../types/infiltrationTest.type';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from 'src/app/types/user.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';
import { MainService } from '../main/main.service';
import { Recipe } from 'src/app/types/recipe.type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private socket: Socket | undefined;
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private url = '';

  constructor(
    private storage: StorageService,
    private authService: AuthService,
    private mainService: MainService
  ) { }

  public async init() {
    try {
      this.storage.storageCreated.subscribe(async () => {
        Promise.all([
          await this.storage.get('serverProtocol'),
          await this.storage.get('serverIp'),
          await this.storage.get('serverPort')
        ]).then(([protocol, serverIp, serverPort]) => {
          this.protocol = protocol;
          this.serverIp = serverIp;
          this.serverPort = serverPort;
          this.url = `${this.protocol}://${this.serverIp}:${this.serverPort}`;

          this.socket = io(this.url, {
            transports: ['websocket'],
            withCredentials: true,
          });

          this.socket.on('connect', () => {
            console.log('Connected to API service');
          });
        });
      });
    } catch (error) {
      console.error('Error initializing API service:', error);
    }

    console.log('API service initialized');
  }

  public authenticate(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('authenticate');
      this.socket?.on('authenticated', (user: User) => {
        resolve({ type: 'success', payload: { message: 'Authenticated successfully', user } });
        this.authService.userAuthenticated.emit(user);
        this.authService.isAuthenticating.emit(false);
        this.authService.authenticationChanged.emit(true);
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Authentication failed', error } });
      });
    });
  }

  public createUser(user: User): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('createUser', user);
      this.socket?.on('userCreated', (user: User) => {
        resolve({ type: 'success', payload: { message: 'User created successfully', user } });
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'User creation failed', error } });
      });
    });
  }

  public verficationCompleted(infiltrationTest: InfiltrationTest): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('verificationCompleted', infiltrationTest);
      this.socket?.on('verificationCompleted', async (infiltrationTest: InfiltrationTest) => {
        resolve({ type: 'success', payload: { message: 'Verification completed successfully', infiltrationTest } });
        await this.storage.set(infiltrationTest.id!, infiltrationTest).then(() => { console.log('Verification completed') });
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Verification failed', error } });
      });
    });
  }

  public codeBarsReader(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.on('codeBarsData', (recipe: Recipe) => {
        resolve({ type: 'success', payload: { message: 'Data read successfully', recipe } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('CodeBarsReader error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }
}
