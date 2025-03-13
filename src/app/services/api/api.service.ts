import { InfiltrationTest } from './../../types/infiltrationTest.type';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from 'src/app/types/user.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private socket: Socket | undefined;
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private url = '';
  @Output() public isApiConnected: EventEmitter<boolean> = new EventEmitter();
  @Output() public isBackgroundServiceInitialized: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private storage: StorageService,
    private authService: AuthService,
  ) { }

  public async init() {
    try {
      this.storage.storageCreated.subscribe(async () => {
        Promise.all([
          await this.storage.get('serverProtocol'),
          await this.storage.get('serverIp'),
          await this.storage.get('serverPort')
        ]).then(([protocol, serverIp, serverPort]) => {
          this.protocol = protocol || 'https';
          this.serverIp = serverIp || 'prova-hidrica';
          this.serverPort = serverPort || '4000';
          this.url = `${this.protocol}://${this.serverIp}:${this.serverPort}`;

          this.socket = io(this.url, {
            transports: ['websocket'],
            withCredentials: true,
          });

          this.socket.on('connect', () => {
            console.log('Connected to API service');
            this.isApiConnected.emit(true);
          });

          this.socket.on('backgroundServiceInitialized', () => {
            this.isBackgroundServiceInitialized.emit(true);
          });

          this.socket.on('disconnect', () => {
            console.log('Disconnected from API service');
            this.isApiConnected.emit(false);
          });
        });
      });
    } catch (error) {
      console.error('Error initializing API service:', error);
    }

    console.log('API service initialized');
  }

  public connectBackgroundService(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('startBackgroundService');
      this.socket?.on('startBackgroundService', () => {
        resolve({ type: 'success', payload: { message: 'Background service successfully launched' } });
        window.location.href = 'provahidrica:';
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Background service launch failed', error } });
      });
    });
  }

  public authenticate(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('authenticate');
      this.socket?.on('authenticated', (user: User) => {
        resolve({ type: 'success', payload: { message: 'Authenticated successfully', user } });
        this.authService.setLoggedUser(user);
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

  public verficationCompleted(testId: string, infiltrationTest: InfiltrationTest): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('verificationCompleted', infiltrationTest);
      this.socket?.on('verificationCompleted', async (infiltrationTest: InfiltrationTest) => {
        await this.storage.set(infiltrationTest.id!, infiltrationTest).then(() => { console.log('Verification completed') });
        resolve({ type: 'success', payload: { message: 'Verification completed successfully', infiltrationTest } });
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Verification failed', error } });
      });
    });
  }

  public BarcodeReader(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.on('barcodeData', (data: SocketResponse) => {
        resolve({ type: 'success', payload: { message: 'Data read successfully', data } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('barcodeReader error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  public sendBarcodeData(barcode: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('sendingBarcode', barcode);
      this.socket?.on('recipeLoaded', (recipe: SocketResponse) => {
        resolve({ type: 'success', payload: { message: 'Recipe loaded successfully', recipe } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('sendBarcodeData error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  public enableOperation(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('enableOperation');
      this.socket?.on('operationEnabled', () => {
        resolve({ type: 'success', payload: { message: 'Operation enabled successfully' } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('startOperation error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }
}
