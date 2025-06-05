import { Status } from "./testResult.type";
export type Operation = {
  OperationId?: string;
  Vp: string;
  Cabin: string;
  Chassis: string;
  Cis: string;
  Operator: string;
  Recipe: number;
  Status: Status;
  [key: string]: any;
  StartTime: string;
  EndTime: string;
  CreatedAt?: Date;
  Duration?: string;
}
