import { Context } from './context.type';
import { ShiftWork } from './shiftwork.type';

export type User = {
  user_id: string;
  name: string;
  origin: string;
  company: string;
  badge_number: number;
  plant: string;
  createdAt: Date;
  updatedAt: Date;
  context: Context;
  shift_work: ShiftWork;
  permissions: string[];
}
