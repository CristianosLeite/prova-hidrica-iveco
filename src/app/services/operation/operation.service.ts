import { Injectable, Output, EventEmitter } from '@angular/core';
import { IOperationService } from 'src/app/interfaces/IOperationService.interface';
import { Operation } from 'src/app/types/operation.type';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService implements IOperationService {
  private protocol = '';
  private serverIp = '';
  private serverPort = '';
  private baseUrl = '';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  @Output() operationCreated = new EventEmitter<Operation>();

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
    this.baseUrl = `${this.protocol}://${this.serverIp}:${this.serverPort}/api/operations`;
  }

  async createOperation(operation: Operation): Promise<Operation> {
    await this.init();
    return await lastValueFrom(this.http.post<Operation>(`${this.baseUrl}/create`, operation, { headers: this.headers })).then((operation: Operation) => {
      this.operationCreated.emit(operation);
      return operation;
    });
  }

  async retrieveAllOperations(): Promise<Operation[]> {
    await this.init();
    return await lastValueFrom(this.http.get<Operation[]>(`${this.baseUrl}/all`, { headers: this.headers }));
  }

  async retrieveOperationById(id: string): Promise<Operation> {
    await this.init();
    return await lastValueFrom(this.http.get<Operation>(`${this.baseUrl}/one?operation_id=${id}`, { headers: this.headers }));
  }

  async retrieveLastOperationsByAmount(amount: number): Promise<Operation[]> {
    await this.init();
    return await lastValueFrom(this.http.get<Operation[]>(`${this.baseUrl}/amount?amount=${amount}`, { headers: this.headers }));
  }

  async retrieveOperationsByOperator(badge_number: string): Promise<Operation[]> {
    await this.init();
    return await lastValueFrom(this.http.get<Operation[]>(`${this.baseUrl}/operator?badge_number=${badge_number}`, { headers: this.headers }));
  }

  async retrieveOperationsByRecipe(recipe: string): Promise<Operation[]> {
    await this.init();
    return await lastValueFrom(this.http.get<Operation[]>(`${this.baseUrl}/recipe?recipe_id=${recipe}`, { headers: this.headers }));
  }

  async retrieveOperationsByDateInterval(from: Date, to: Date): Promise<Operation[]> {
    await this.init();
    return await lastValueFrom(this.http.get<Operation[]>(`${this.baseUrl}/date?from=${from}&to=${to}`, { headers: this.headers }));
  }

  async updateOperation(operation: Operation): Promise<Operation> {
    await this.init();
    return await lastValueFrom(this.http.put<Operation>(`${this.baseUrl}/update`, operation, { headers: this.headers }));
  }

  async deleteOperation(id: string): Promise<void> {
    await this.init();
    await lastValueFrom(this.http.delete(`${this.baseUrl}/delete?operation_id=${id}`, { headers: this.headers }));
  }
}
