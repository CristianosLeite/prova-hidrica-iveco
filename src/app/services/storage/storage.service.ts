import {EventEmitter, Injectable, Output} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  @Output() storageCreated: EventEmitter<boolean> = new EventEmitter();

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this._storage = await this.storage.create();
    this.storageCreated.emit(true);
  }

  /**
   * Set a key/value pair in storage
   * @param key
   * @param value
   */
  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  /**
   * Get a value from storage
   * @param key
   * @returns
   */
  public async get(key: string) {
    return this._storage?.get(key);
  }
}
