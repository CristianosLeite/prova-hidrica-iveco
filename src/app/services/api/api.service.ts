import { InfiltrationTest } from './../../types/infiltrationTest.type';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from 'src/app/types/user.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';
import { Recipe } from 'src/app/types/recipe.type';
import { Device } from 'src/app/types/device.type';

/**
 * * ApiService is responsible for managing the connection to the API service using Socket.IO.
 * * It handles events such as connection, disconnection, and background service initialization.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * * Socket.IO client instance.
   */
  private socket: Socket | undefined;
  /**
   * * Server connection parameters.
   */
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  /**
   * * Server URL.
   */
  private url = '';
  /**
   * * Event emitter for API connection status.
   */
  @Output() public isApiConnected: EventEmitter<boolean> = new EventEmitter();
  /**
   * * Event emitter for background service initialization status.
   */
  @Output() public isBackgroundServiceInitialized: EventEmitter<boolean> = new EventEmitter();

  private keepAliveInterval: any;

  constructor(
    private storage: StorageService,
    private authService: AuthService,
  ) { }

  /**
   * * Initializes the API service by setting up the Socket.IO connection and event listeners.
   * * It retrieves server connection parameters from storage and connects to the server.
   */
  public async init() {
    try {
      // Get server connection parameters from storage
      this.storage.storageCreated.subscribe(async () => {
        await Promise.all([
          this.storage.get('serverProtocol'),
          this.storage.get('serverIp'),
          this.storage.get('serverPort')
        ]).then(([protocol, serverIp, serverPort]) => {
          // Set default values if not provided
          this.protocol = protocol || 'https';
          this.serverIp = serverIp || '172.29.96.2';
          this.serverPort = serverPort || '4000';
          this.url = `${this.protocol}://${this.serverIp}:${this.serverPort}`;

          // Initialize Socket.IO connection
          this.socket = io(this.url, {
            transports: ['websocket'],
            withCredentials: true,
            reconnection: true, // Enable automatic reconnection
            reconnectionAttempts: Infinity, // Unlimited reconnection attempts
            reconnectionDelay: 1000, // Initial delay between attempts
            reconnectionDelayMax: 5000, // Maximum delay between attempts
          });

          // Emit keep-alive events
          this.keepAliveInterval = setInterval(() => {
            this.socket?.emit("keep-alive-response", { status: "active" });
          }, 15000);

          // Handle connection events
          this.socket.on('connect', () => {
            console.log('Connected to API service');
            this.isApiConnected.emit(true);
          });

          this.socket.on('disconnect', () => {
            this.isApiConnected.emit(false);
            if (this.keepAliveInterval) {
              clearInterval(this.keepAliveInterval);
            }
          });

          // Handle reconnection errors
          this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
          });

          this.socket.on('reconnect', (attemptNumber) => {
            console.log(`Reconnected to API service after ${attemptNumber} attempts`);
          });

          this.socket.on('backgroundServiceInitialized', () => {
            this.isBackgroundServiceInitialized.emit(true);
          });

          this.socket.on("unauthenticated", () => {
            this.authService.logOut();
          });
        })
          .catch((error) => {
            console.error('Error retrieving server parameters:', error);
          });
      });
    } catch (error) {
      console.error('Error initializing API service:', error);
    }

    console.log('API service initialized');
  }

  //   private handleSocketEvent<T>(event: string): Promise<T> {
  //   return new Promise((resolve, reject) => {
  //     this.socket?.on(event, (data: T) => resolve(data));
  //     this.socket?.on('error', (error: any) => reject(error));
  //   });
  // }

  /**
   * * Connects to the background service and emits an event to start it.
   * * It also handles the response from the background service.
   * * @returns A promise that resolves with the socket response.
   */
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

  /**
   * * Authenticates the user by emitting an authentication event and handling the response.
   * * It also sets the logged-in user in the AuthService.
   * * @param sendMessage - Optional parameter to control whether to send the authentication message.
   * * @returns A promise that resolves with the socket response.
   */
  public listenAuthentication(sendMessage: boolean = true): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (sendMessage) this.socket?.emit('authenticate')
      this.socket?.on('authenticated', (user: User) => {
        resolve({ type: 'success', payload: { message: 'Authenticated successfully', user } });
        this.authService.setLoggedUser(user);
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Authentication failed', error } });
      });
    });
  }

  /**
   * Unauthenticate the user by emitting an unauthentication event and handling the response.
   * * It also logs out the user from the AuthService.
   * @param sendMessage - Optional parameter to control whether to send the unauthentication message.
   * @returns
   */
  public listenUnAuthentication(sendMessage: boolean = true): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      if (sendMessage) this.socket?.emit('unAuthenticate')
      this.socket?.on('unAuthenticated', () => {
        resolve({ type: 'success', payload: { message: 'Unauthenticated successfully' } });
        this.authService.logOut();
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Unauthentication failed', error } });
      });
    });
  }

  /**
   * * Creates a new user by emitting a user creation event and handling the response.
   * * It also sets the logged-in user in the AuthService.
   * @param user - The user object to be created.
   * @returns A promise that resolves with the socket response.
   */
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

  /**
   * * Signals that a check has been completed by the operator.
   * * It emits an event to the server and also updates the local storage with the test result when it comes from another device.
   * @param testId
   * @param infiltrationTest
   * @returns
   */
  public verficationCompleted(infiltrationTest: InfiltrationTest): Promise<SocketResponse> {
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

  /**
   * Handles the barcode reader events and recipe provided by the server.
   * @returns A promise that resolves with the socket response.
   */
  public BarcodeReader(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.on('barcodeData', (data: string) => {
        resolve({ type: 'success', payload: { message: 'Data read successfully', data } });
      });
      this.socket?.on('recipeLoaded', (recipe: Recipe) => {
        resolve({ type: 'success', payload: { message: 'Recipe loaded successfully', recipe } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('barcodeReader error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  /**
   * Sends the barcode data to the server and handles the response.
   * @param barcode - The barcode data to be sent.
   * @returns A promise that resolves with the socket response.
   */
  public sendBarcodeData(barcode: string): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('sendingBarcode', barcode);
      this.socket?.on('recipeLoaded', (recipe: Recipe) => {
        resolve({ type: 'success', payload: { message: 'Recipe loaded successfully', recipe } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('sendBarcodeData error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  /**
   * * Enables the operation by emitting an event to the server and handling the response.
   * @returns A promise that resolves with the socket response.
   */
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

  /**
   * * Reset alarms and start operation again.
   * @returns A promise that resolves with the socket response.
   */
  public resetOperation(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('resetOperation');
      this.socket?.on('operationReset', () => {
        resolve({ type: 'success', payload: { message: 'Operation reset successfully' } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('resetOperation error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  /**
   * * Stops the operation by emitting an event to the server and handling the response.
   * @returns A promise that resolves with the socket response.
   */
  public stopOperation(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('stopOperation');
      this.socket?.on('operationStopped', async () => {
        resolve({ type: 'success', payload: { message: 'Operation stopped successfully' } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('stopOperation error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  /**
   * * Sends device data info to the server and handles the response.
   * @param device - The device object to be sent.
   * @returns A promise that resolves with the socket response.
   */
  public sendDeviceData(device: Device): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('sendDeviceData', device);
      this.socket?.on('deviceDataRecieved', (devices: Device[]) => {
        resolve({ type: 'success', payload: { message: 'Device data sent successfully', devices } });
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Device data send failed', error } });
      });
    });
  }

  /**
   * * Send a command to open the pick-by-open door and handle the response.
   * @returns A promise that resolves with the socket response.
   */
  public openDoor(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('openDoor');
      this.socket?.on('doorOpened', () => {
        resolve({ type: 'success', payload: { message: 'Door opened successfully' } });
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Door opening failed', error } });
      });
    });
  }

  /**
   * Handles the door closed event and logs out the user.
   * @returns A promise that resolves with the socket response.
   */
  public doorClosed(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.on('doorClosed', async () => {
        resolve({ type: 'success', payload: { message: 'Door closed successfully' } });
        await this.listenUnAuthentication().then(() => {
          this.authService.logOut();
        });
      });
      this.socket?.on('error', (error: any) => {
        reject({ type: 'error', payload: { message: 'Door closing failed', error } });
      });
    });
  }

  /**
   * * Stops the operation by emitting an event to the server and handling the response.
   * @returns A promise that resolves with the socket response.
   */
  public finishOperation(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('finishOperation');
      this.socket?.on('operationFinished', async () => {
        resolve({ type: 'success', payload: { message: 'Operation stopped successfully' } });
      });
      this.socket?.on('error', (error: any) => {
        console.log('finishOperation error:', error);
        reject({ type: 'error', payload: { message: error['message'] } });
      });
    });
  }

  /**
   * Stops listening for barcode reader events by removing event listeners.
   * Used when a component is destroyed to prevent memory leaks.
   */
  public stopBarcodeReader(): void {
    this.socket?.removeAllListeners('barcodeData');
    this.socket?.removeAllListeners('recipeLoaded');
    console.log('Barcode reader listeners removed');
  }
}
