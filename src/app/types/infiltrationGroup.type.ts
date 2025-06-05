export type InfiltrationGroup = {
  name: string;
  points: Array<{
    id: number;
    name: string;
    value: boolean;
  }>;
}
