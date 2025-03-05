import { InfiltrationPoints } from "./infiltrationPoints.type";

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
}
