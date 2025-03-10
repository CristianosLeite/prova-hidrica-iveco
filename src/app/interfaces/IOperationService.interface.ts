import { Operation } from '../types/operation.type';

export interface IOperationService {
  createOperation(Operation: Operation): Promise<Operation>;
  retrieveAllOperations(): Promise<Operation[]>;
  retrieveOperationById(id: string): Promise<Operation>;
  retrieveOperationsByOperator(operator: string): Promise<Operation[]>;
  retrieveOperationsByRecipe(recipe: string): Promise<Operation[]>;
  retrieveOperationsByDateInterval(start: Date, end: Date): Promise<Operation[]>;
  updateOperation(operation: Operation): Promise<Operation>;
  deleteOperation(id: string): Promise<void>;
}
