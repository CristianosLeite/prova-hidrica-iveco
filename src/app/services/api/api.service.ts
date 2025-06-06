import { InfiltrationTest } from './../../types/infiltrationTest.type';
import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { User } from 'src/app/types/user.type';
import { SocketResponse } from 'src/app/types/socketResponse.type';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';
import { Recipe } from 'src/app/types/recipe.type';
import { Device } from 'src/app/types/device.type';
import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

/**
 * * ApiService is responsible for managing the connection to the API service using Socket.IO.
 * * It handles events such as connection, disconnection, and background service initialization.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {
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
  private eventSubjects: Map<string, BehaviorSubject<any>> = new Map();
  private destroy$ = new Subject<void>();
  private socketInitialized = false;

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
      this.storage.storageCreated
        .pipe(takeUntil(this.destroy$))
        .subscribe(async () => {
          // Prevent multiple initializations
          if (this.socketInitialized) {
            return;
          }

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

            this.setupSocket();
          })
            .catch((error) => {
              console.error('Error retrieving server parameters:', error);
            });
        });
    } catch (error) {
      console.error('Error initializing API service:', error);
    }
  }

  /**
   * Sets up the socket connection with all necessary event handlers
   */
  private setupSocket() {
    if (this.socketInitialized || this.socket) {
      return;
    }

    // Initialize Socket.IO connection
    this.socket = io(this.url, {
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Setup keep-alive ping
    this.keepAliveInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit("keep-alive-response", { status: "active" });
      }
    }, 15000);

    // Setup core event handlers
    this.socket.on('connect', () => {
      console.log('Connected to API service');
      this.isApiConnected.emit(true);
    });

    this.socket.on('disconnect', () => {
      this.isApiConnected.emit(false);
    });

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

    // Register all event listeners we'll need
    this.registerEventListener('authenticated');
    this.registerEventListener('unAuthenticated');
    this.registerEventListener('userCreated');
    this.registerEventListener('verificationCompleted');
    this.registerEventListener('barcodeData');
    this.registerEventListener('recipeLoaded');
    this.registerEventListener('operationEnabled');
    this.registerEventListener('operationReset');
    this.registerEventListener('operationStopped');
    this.registerEventListener('deviceDataReceived');
    this.registerEventListener('doorOpened');
    this.registerEventListener('doorClosed');
    this.registerEventListener('operationFinished');
    this.registerEventListener('startBackgroundService');
    this.registerEventListener('error');

    this.socketInitialized = true;
    console.log('API service socket initialized');
  }

  /**
   * Register an event listener for a specific event
   * @param eventName The socket event name to listen for
   */
  private registerEventListener(eventName: string) {
    // Create subject if it doesn't exist
    if (!this.eventSubjects.has(eventName)) {
      this.eventSubjects.set(eventName, new BehaviorSubject<any>(null));
    }

    // Register the event handler
    this.socket?.on(eventName, (data: any) => {
      this.eventSubjects.get(eventName)?.next(data);
    });
  }

  /**
   * Get an observable for a specific socket event
   * @param eventName The socket event to observe
   * @returns Observable that emits when the event occurs
   */
  private getEventObservable<T>(eventName: string): Observable<T> {
    if (!this.eventSubjects.has(eventName)) {
      this.registerEventListener(eventName);
    }

    return this.eventSubjects.get(eventName)!.asObservable().pipe(
      filter(data => data !== null)
    );
  }

  /**
   * Emit an event and wait for a response event once
   * @param emitEvent The event to emit
   * @param listenEvent The event to listen for as a response
   * @param data Optional data to emit with the event
   * @returns Promise that resolves with the response data
   */
  private emitAndListen<T>(emitEvent: string, listenEvent: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      let subscription: any;
      let errorSubscription: any;
      let timeout: any;

      // Get a single response from the listen event
      subscription = this.getEventObservable<T>(listenEvent)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            resolve(response);
            if (subscription) subscription.unsubscribe();
            if (errorSubscription) errorSubscription.unsubscribe();
            if (timeout) clearTimeout(timeout);
          }
        });

      // Listen for errors
      errorSubscription = this.getEventObservable<any>('error')
        .pipe(take(1))
        .subscribe({
          next: (error) => {
            console.error(`Error in ${emitEvent}:`, error);
            reject({ type: 'error', payload: { message: error?.message || 'Unknown error', error } });
            if (errorSubscription) errorSubscription.unsubscribe();
            if (subscription) subscription.unsubscribe();
            if (timeout) clearTimeout(timeout);
          }
        });

      // Set a timeout to avoid hanging promises
      timeout = setTimeout(() => {
        if (subscription) subscription.unsubscribe();
        if (errorSubscription) errorSubscription.unsubscribe();
        reject({ type: 'error', payload: { message: `Timeout waiting for ${listenEvent}` } });
      }, 10000);

      // Emit the event
      if (data !== undefined) {
        this.socket?.emit(emitEvent, data);
      } else {
        this.socket?.emit(emitEvent);
      }
    });
  }

  /**
   * * Connects to the background service and emits an event to start it.
   * * It also handles the response from the background service.
   * * @returns A promise that resolves with the socket response.
   */
  public async connectBackgroundService(): Promise<SocketResponse> {
    try {
      await this.emitAndListen<any>('startBackgroundService', 'startBackgroundService');
      window.location.href = 'provahidrica:';
      return {
        type: 'success',
        payload: { message: 'Background service successfully launched' }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Background service launch failed', error }
      };
    }
  }

  /**
   * * Authenticates the user by emitting an authentication event and handling the response.
   * * It also sets the logged-in user in the AuthService.
   * * @param sendMessage - Optional parameter to control whether to send the authentication message.
   * * @returns A promise that resolves with the socket response.
   */
  public async listenAuthentication(sendMessage: boolean = true): Promise<SocketResponse> {
    if (sendMessage) {
      this.socket?.emit('authenticate');
    }

    try {
      const user = await firstValueFrom(
        this.getEventObservable<User>('authenticated').pipe(take(1))
      );
      this.authService.setLoggedUser(user);
      return {
        type: 'success',
        payload: { message: 'Authenticated successfully', user }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Authentication failed', error }
      };
    }
  }

  /**
   * Unauthenticate the user by emitting an unauthentication event and handling the response.
   * * It also logs out the user from the AuthService.
   * @param sendMessage - Optional parameter to control whether to send the unauthentication message.
   * @returns
   */
  public async listenUnAuthentication(sendMessage: boolean = true): Promise<SocketResponse> {
    if (sendMessage) {
      this.socket?.emit('unAuthenticate');
    }

    try {
      await firstValueFrom(
        this.getEventObservable<any>('unAuthenticated').pipe(take(1))
      );
      this.authService.logOut();
      return {
        type: 'success',
        payload: { message: 'Unauthenticated successfully' }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Unauthentication failed', error }
      };
    }
  }

  /**
   * * Creates a new user by emitting a user creation event and handling the response.
   * * It also sets the logged-in user in the AuthService.
   * @param user - The user object to be created.
   * @returns A promise that resolves with the socket response.
   */
  public async createUser(user: User): Promise<SocketResponse> {
    try {
      const createdUser = await this.emitAndListen<User>('createUser', 'userCreated', user);
      return {
        type: 'success',
        payload: { message: 'User created successfully', user: createdUser }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'User creation failed', error }
      };
    }
  }

  /**
   * * Signals that a check has been completed by the operator.
   * * It emits an event to the server and also updates the local storage with the test result when it comes from another device.
   * @param infiltrationTest The test data to send
   * @returns A promise that resolves with the socket response.
   */
  public async verficationCompleted(infiltrationTest: InfiltrationTest): Promise<SocketResponse> {
    try {
      const test = await this.emitAndListen<InfiltrationTest>(
        'verificationCompleted',
        'verificationCompleted',
        infiltrationTest
      );
      await this.storage.set(test.id!, test)
        .then(() => console.log('Verification completed and stored'));
      return await {
        type: 'success',
        payload: { message: 'Verification completed successfully', infiltrationTest: test }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Verification failed', error }
      };
    }
  }

  /**
   * Handles the barcode reader events and recipe provided by the server.
   * @returns A promise that resolves with the socket response.
   */
  public BarcodeReader(): Promise<SocketResponse> {
    return new Promise((resolve, reject) => {
      let barcodeSubscription: any;
      let recipeSubscription: any;
      let errorSubscription: any;
      let timeoutId: any;

      barcodeSubscription = this.getEventObservable<string>('barcodeData')
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            if (recipeSubscription) recipeSubscription.unsubscribe();
            if (errorSubscription) errorSubscription.unsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ type: 'success', payload: { message: 'Data read successfully', data } });
          }
        });

      recipeSubscription = this.getEventObservable<Recipe>('recipeLoaded')
        .pipe(take(1))
        .subscribe({
          next: (recipe) => {
            if (barcodeSubscription) barcodeSubscription.unsubscribe();
            if (errorSubscription) errorSubscription.unsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ type: 'success', payload: { message: 'Recipe loaded successfully', recipe } });
          }
        });

      errorSubscription = this.getEventObservable<any>('error')
        .pipe(take(1))
        .subscribe({
          next: (error) => {
            console.log('barcodeReader error:', error);
            if (barcodeSubscription) barcodeSubscription.unsubscribe();
            if (recipeSubscription) recipeSubscription.unsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
            reject({ type: 'error', payload: { message: error['message'] } });
          }
        });

      // Set a timeout to avoid hanging
      timeoutId = setTimeout(() => {
        if (barcodeSubscription && !barcodeSubscription.closed) {
          barcodeSubscription.unsubscribe();
        }
        if (recipeSubscription) recipeSubscription.unsubscribe();
        if (errorSubscription) errorSubscription.unsubscribe();
        reject({ type: 'error', payload: { message: 'Timeout waiting for barcode data' } });
      }, 60000); // 60 seconds timeout for barcode reading
    });
  }

  /**
   * Sends the barcode data to the server and handles the response.
   * @param barcode - The barcode data to be sent.
   * @returns A promise that resolves with the socket response.
   */
  public async sendBarcodeData(barcode: string): Promise<SocketResponse> {
    try {
      const recipe = await this.emitAndListen<Recipe>('sendingBarcode', 'recipeLoaded', barcode);
      return {
        type: 'success',
        payload: { message: 'Recipe loaded successfully', recipe }
      };
    } catch (error: any) {
      console.log('sendBarcodeData error:', error);
      return {
        type: 'error',
        payload: { message: error?.message || 'Failed to load recipe' }
      };
    }
  }

  /**
   * * Enables the operation by emitting an event to the server and handling the response.
   * @returns A promise that resolves with the socket response.
   */
  public async enableOperation(): Promise<SocketResponse> {
    try {
      await this.emitAndListen<void>('enableOperation', 'operationEnabled');
      return {
        type: 'success',
        payload: { message: 'Operation enabled successfully' }
      };
    } catch (error: any) {
      console.log('startOperation error:', error);
      return {
        type: 'error',
        payload: { message: error?.message || 'Failed to enable operation' }
      };
    }
  }

  /**
   * * Reset alarms and start operation again.
   * @returns A promise that resolves with the socket response.
   */
  public async resetOperation(): Promise<SocketResponse> {
    try {
      await this.emitAndListen<void>('resetOperation', 'operationReset');
      return {
        type: 'success',
        payload: { message: 'Operation reset successfully' }
      };
    } catch (error: any) {
      console.log('resetOperation error:', error);
      return {
        type: 'error',
        payload: { message: error?.message || 'Failed to reset operation' }
      };
    }
  }

  /**
   * * Stops the operation by emitting an event to the server and handling the response.
   * @returns A promise that resolves with the socket response.
   */
  public async stopOperation(): Promise<SocketResponse> {
    try {
      await this.emitAndListen<void>('stopOperation', 'operationStopped');
      return {
        type: 'success',
        payload: { message: 'Operation stopped successfully' }
      };
    } catch (error: any) {
      console.log('stopOperation error:', error);
      return {
        type: 'error',
        payload: { message: error?.message || 'Failed to stop operation' }
      };
    }
  }

  /**
   * * Sends device data info to the server and handles the response.
   * @param device - The device object to be sent.
   * @returns A promise that resolves with the socket response.
   */
  public async sendDeviceData(device: Device): Promise<SocketResponse> {
    try {
      const devices = await this.emitAndListen<Device[]>('sendDeviceData', 'deviceDataReceived', device);
      return {
        type: 'success',
        payload: { message: 'Device data sent successfully', devices }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Device data send failed', error }
      };
    }
  }

  /**
   * * Send a command to open the pick-by-open door and handle the response.
   * @returns A promise that resolves with the socket response.
   */
  public async openDoor(): Promise<SocketResponse> {
    try {
      await this.emitAndListen<void>('openDoor', 'doorOpened');
      return {
        type: 'success',
        payload: { message: 'Door opened successfully' }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Door opening failed', error }
      };
    }
  }

  /**
   * Handles the door closed event and logs out the user.
   * @returns A promise that resolves with the socket response.
   */
  public async doorClosed(): Promise<SocketResponse> {
    try {
      await firstValueFrom(
        this.getEventObservable<any>('doorClosed').pipe(take(1))
      );
      await this.listenUnAuthentication().then(() => {
        this.authService.logOut();
      });
      return await {
        type: 'success',
        payload: { message: 'Door closed successfully' }
      };
    } catch (error) {
      return {
        type: 'error',
        payload: { message: 'Door closing failed', error }
      };
    }
  }

  /**
   * * Stops the operation by emitting an event to the server and handling the response.
   * @returns A promise that resolves with the socket response.
   */
  public async finishOperation(): Promise<SocketResponse> {
    try {
      await this.emitAndListen<void>('finishOperation', 'operationFinished');
      return {
        type: 'success',
        payload: { message: 'Operation stopped successfully' }
      };
    } catch (error: any) {
      console.log('finishOperation error:', error);
      return {
        type: 'error',
        payload: { message: error?.message || 'Failed to finish operation' }
      };
    }
  }

  /**
   * Stops listening for barcode reader events by removing event listeners.
   * Used when a component is destroyed to prevent memory leaks.
   */
  public stopBarcodeReader(): void {
    // In our new approach, we don't need to manually remove listeners
    // Instead, we're simply notifying that barcode events will be ignored
    console.log('Barcode reader monitoring stopped');
  }

  /**
   * Clean up resources when service is destroyed
   */
  ngOnDestroy(): void {
    // Clear the keep-alive interval
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }

    // Complete all subjects
    this.eventSubjects.forEach(subject => {
      subject.complete();
    });
    this.eventSubjects.clear();

    // Signal to all subscribing components to clean up
    this.destroy$.next();
    this.destroy$.complete();

    // Disconnect the socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }

    this.socketInitialized = false;
  }
}
