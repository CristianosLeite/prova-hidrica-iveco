import { Injectable, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

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
    const storage = await this.storage.create();
    this._storage = storage;
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
    return await this._storage?.get(key);
  }
}
