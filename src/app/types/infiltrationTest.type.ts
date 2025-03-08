import { InfiltrationPoints } from "./infiltrationPoints.type";
import { Result } from "./testResult.type";

export type InfiltrationTest = {
  id?: string;
  title: string;
  url: string;
  img: string;
  testImg: string;
  altImg: string;
  content: string;
  status: string;
  infiltrationPoints?: InfiltrationPoints;
  result: Result;
}
