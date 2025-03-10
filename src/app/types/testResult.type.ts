export type Status = 'APROVADO' | 'REPROVADO';
export type Result = 'OK' | 'NOK';

export type TestResult = {
  operationId: string;
  van: string;
  description: string;
  status: Status;
  date: string;
  time: string;
  duration: string;
  operator: string;
  upsideTestResult: Result;
  frontsideTestResult: Result;
  backsideTestResult: Result;
  leftsideTestResult: Result;
  rightsideTestResult: Result;
}
