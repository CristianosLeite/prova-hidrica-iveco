import { Injectable, Output, EventEmitter } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from 'src/app/types/user.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private socket: Socket | undefined;
  @Output() public userAuthenticated = new EventEmitter<User>();

  public init() {
    try {
      this.socket = io('https://localhost:4000', {
        transports: ['websocket'],
        withCredentials: true,
      });
      this.socket.on('connect', () => {
        console.log('Connected to API service');
      });
      this.socket.on('userAuthenticated', (user: User) => {
        console.log('User authenticated:', user);
      });
    } catch (error) {
      console.error('Error initializing API service:', error);
    }

    console.log('API service initialized');
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
}
