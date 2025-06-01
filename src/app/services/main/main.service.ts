import { RunComponent } from './../../components/run/run.component';
import { InfiltrationPointsComponent } from './../../components/infiltration-points/infiltration-points.component';
import { EventEmitter, Injectable, Output, signal, WritableSignal } from '@angular/core';
import { IMainApplication, StopOptions } from 'src/app/interfaces/IMainApplication.inteface';
import { InfiltrationPoints } from 'src/app/types/infiltrationPoints.type';
import { InfiltrationTest } from 'src/app/types/infiltrationTest.type';
import { Storage } from '@ionic/storage';
import { Recipe } from 'src/app/types/recipe.type';
import { Operation } from 'src/app/types/operation.type';
import { OperationService } from '../operation/operation.service';
import { Result, Status, TestResult } from 'src/app/types/testResult.type';
import { UserService } from '../user/user.service';
// import { PrinterService } from '../printer/printer.service';
import UpsideTestModel from 'src/app/models/upside-test.model';
import FrontsideTestModel from 'src/app/models/frontside-test.model';
import BacksideTestModel from 'src/app/models/backside-test.model';
import LeftsideTestModel from 'src/app/models/leftside-test.model';
import RightsideTestModel from 'src/app/models/rightside-test.model';
import { Platform } from 'src/app/types/device.type';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

/**
 * Main service class
 * Handle the business logic of the application during the infiltration tests execution
 * @implements IMainApplication
 */
@Injectable({
  providedIn: 'root'
})
export class MainService implements IMainApplication {
  /**
   * - These are the infiltration tests that must be performed. Each test has an id, title, url, image, test image, content, status and result.
   * - It is used in the construction of the {@link InfiltrationPointsComponent} component dinamically.
   * @type {WritableSignal<InfiltrationTest[]>}
   */
  public tests: WritableSignal<InfiltrationTest[]> = signal([
    UpsideTestModel,
    FrontsideTestModel,
    BacksideTestModel,
    LeftsideTestModel,
    RightsideTestModel
  ]);

  /**
   * Each test added to the tests array must be referenced by its key.
   * @type {string[]} testKeys
   */
  private testKeys: string[] = ['upside', 'frontside', 'backside', 'leftside', 'rightside'];

  /**
   * Used to store the recipe loaded from the database.
   * @type {Recipe}
   */
  private recipe: Recipe = {} as Recipe;
  /**
   * It is used to update the quantity of completed verifications in the {@link RunComponent} component.
   * @type {number}
   */
  private qtyTests: number = this.tests().length;
  /**
   * - It is used to store the infiltration points of the tests that have been completed.
   * - Posteriously, it will be adeed to the operation before sending it to the backend.
   * @type {InfiltrationPoints}
   */
  private infiltrationPoints: InfiltrationPoints = {};
  /**
   * It is used to store the start time of the operation.
   * This data is used to calculate the duration of the operation.
   * @type {string}
   */
  private startTime: string = new Date().toISOString();
  /**
   * It is used to store the cabin code retrieved from the barcode scanner.
   * This data guarantees the traceability of the operation.
   * @type {string}
   */
  private cabin: string = '';

  /**
   * It is used to store the chassis code retrieved from the barcode scanner.
   * This data guarantees the traceability of the operation.
   * @type {string}
   */
  private chassis: string = '';

  private platform: Platform = Platform.None;

  /**
   * - Notify the {@link RunComponent} component that the quantity of verifications has changed.
   */
  @Output() qtyVerificationsChanged: EventEmitter<number> = new EventEmitter();
  /**
   * - Notify the {@link RunComponent} component that the recipe has changed.
   */
  @Output() recipeChanged: EventEmitter<Recipe> = new EventEmitter();

  constructor(
    private storage: Storage,
    private operationService: OperationService,
    private usersService: UserService,
    // private printerService: PrinterService
    private apiService: ApiService,
    private router: Router
  ) { }

  /**
   * Update and emit that the recipe has changed.
   * @param recipe @type {Recipe}
   */
  public setRecipe(recipe: Recipe): void {
    this.recipe = recipe;
    this.recipeChanged.emit(recipe);
  }

  /**
   * Retrieve the cabin code stored in the service.
   * @returns The cabin code
   */
  public getCabin(): string {
    return this.cabin;
  }

  /**
   * Set the cabin code and store it in the service.
   * @param cabin - The cabin code
   */
  public setCabin(cabin: string): void {
    this.cabin = cabin;
  }

  /**
   * Set the chassis code and store it in the service.
   * @param chassis - The chassis code
   */
  public setChassis(chassis: string): void {
    this.chassis = chassis;
  }

  /**
   * Retrieve the total of tests to be performed.
   * @returns The quantity of tests
   * @type {number}
   */
  public getQtyTests(): number {
    return this.qtyTests;
  }

  /**
   * Retrieve the start time of the operation stored in the service.
   * @returns The start time of the operation
   * @type {string}
   */
  public getStartTime(): string {
    return this.startTime;
  }

  public setPlatform(platform: Platform): void {
    this.platform = platform;
  }

  public getPlatform(): Platform {
    return this.platform;
  }

  /**
   * Define and updates the initial parameters of the tests.
   */
  private async initializeTests() {
    try {
      for (const key of this.testKeys) {
        // Check if the test is stored in the storage
        await this.storage.get(key).then((test) => {
          if (test) {
            // Update the test status
            const index = this.testKeys.indexOf(key);
            this.tests()[index] = test;
          }
        });
      }
      this.tests.set([...this.tests()]); // Update the tests array
      this.updateQtyVerificationsCompleted();
      this.updateInfiltraionPoints();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Notify the {@link RunComponent} component that the quantity of verifications has changed.
   */
  private updateQtyVerificationsCompleted(): void {
    const qty = this.tests().filter((test) => test.status === 'completed').length;
    this.qtyVerificationsChanged.emit(qty);
  }

  /**
   * Update the infiltration points based on the tests that have been completed.
   */
  private updateInfiltraionPoints(): void {
    this.infiltrationPoints = this.tests().reduce((acc, test) => {
      if (test.status === 'completed') {
        return { ...acc, ...test.infiltrationPoints };
      }
      return acc;
    }, {});
  }

  /**
   * Start the infiltration tests.
   */
  public start(): void {
    this.startTime = new Date().toISOString(); // Set the start time of the operation
    this.initializeTests();
  }

  /**
   * Stop the infiltration tests.
   * @param command - The command to stop the tests (cancel or finish)
   * @param operation - The operation object
   * @returns The operation object if the command is finish
   */
  public async stop(command: StopOptions, operation?: Operation): Promise<Operation | void> {
    switch (command) {
      case 'cancel':
        this.cancelTest();
        break;
      case 'finish':
        return await this.finish(operation!);
    }
  }

  /**
   * Finish the operation and send it to the backend.
   * @param operation
   * @returns The operation object
   */
  private async finish(operation: Operation): Promise<Operation> {
    // Set the operation start and end time
    operation.StartTime = this.startTime;
    operation.EndTime = new Date().toISOString();

    // Add the cabin to the operation before send to backend
    operation.Cabin = this.cabin;

    // Add the chassis to the operation before send to backend
    operation.Chassis = this.chassis;

    // Add the infiltration points to the operation before send to backend
    this.addInfiltrationPointsToOperation(operation);

    // Determine the overall test status
    operation.Status = this.determineTestStatus();

    // Calculate the duration of the operation
    operation.Duration = this.calculateDuration(operation.StartTime, operation.EndTime);

    // Send the operation to the backend
    try {
      return await this.operationService.createOperation(operation).then(async (operation) => {
        if (!operation) throw new Error('Operation not created!');

        // // Create and print the test result
        // await this.createTestResult(operation).then(async (testResult) => {
        //   return await this.printerService.printTestResult(testResult);
        // });

        // Instead of printing, navigate to the test result page
        this.router.navigate(['/main/test-result'], { queryParams: { id: operation.OperationId } });

        this.clearTestParams();
        await this.apiService.finishOperation();
        return operation;
      });
    } catch (error) {
      console.error('Error while creating the operation:', error);
      throw error;
    }
  }

  /**
   * - Create and return a test result object based on the operation.
   * - Object will be used to print the test result.
   * @param operation
   * @returns {TestResult} The test result object
   * @type {TestResult}
   */
  // private async createTestResult(operation: Operation): Promise<TestResult> {
  //   const status = this.determineTestStatus();
  //   const [date, time] = this.getFormattedDateTime(operation.CreatedAt!);
  //   // Operation.Operator is the badge number of the user
  //   const testResult: TestResult = await this.usersService.getUserByBadgeNumber(operation.Operator).then((user) => {
  //     return {
  //       operationId: operation.OperationId!,
  //       vp: operation.Vp,
  //       chassis: operation.Chassis,
  //       cabin: operation.Cabin,
  //       description: this.recipe.Description,
  //       status: status,
  //       date: date,
  //       time: time,
  //       duration: this.calculateDuration(operation.StartTime, operation.EndTime),
  //       operator: `${operation.Operator} - ${user.UserName}`,
  //       upsideTestResult: this.getTestStatus('upside'),
  //       frontsideTestResult: this.getTestStatus('frontside'),
  //       backsideTestResult: this.getTestStatus('backside'),
  //       leftsideTestResult: this.getTestStatus('leftside'),
  //       rightsideTestResult: this.getTestStatus('rightside'),
  //     };
  //   });
  //   return testResult;
  // }

  /**
   * Determine the overall test status based on individual test results.
   * @returns {Status} The overall test status
   */
  private determineTestStatus(): Status {
    for (const test of this.testKeys) {
      if (this.getTestStatus(test) === 'NOK') {
        return 'REPROVADO';
      }
    }
    return 'APROVADO';
  }

  /**
   * Split the date and time string into an array.
   * @param endTime The end time string
   * @returns {[string, string]} An array containing the date and time
   */
  // private getFormattedDateTime(date: Date | string): [string, string] {
  //   const dateObj = new Date(date);
  //   return [dateObj.toLocaleDateString(), dateObj.toLocaleTimeString()];
  // }

  /**
   * Calculate the duration of the operation.
   * @param startTime The start time string
   * @param endTime The end time string
   * @returns {string} The duration of the operation
   */
  private calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    const seconds = ((diff % 60000) / 1000).toFixed(0);
    return this.formatTime(`${hours}:${minutes}:${seconds}`);
  }

  /**
   * Format the time into a string with the format 'mm:ss'.
   * @param time
   * @returns
   */
  private formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    return `${Number(hours) < 10 ? '0'
      + hours : hours}:${Number(minutes) < 10 ? '0'
        + minutes : minutes}:${Number(seconds) < 10 ? '0'
          + seconds : seconds}`;
  }

  /**
   * Retrieve the test status based on the test id.
   * @param testId
   * @returns The test status (OK or NOK)
   * @type {Result}
   */
  private getTestStatus(testId: string): Result {
    const test = this.tests().find((test) => test.id === testId);
    return test!.result;
  }

  /**
   * Add the infiltration points to the operation before send to backend.
   * @param operation
   */
  private addInfiltrationPointsToOperation(operation: Operation): void {
    for (const key in this.infiltrationPoints) {
      operation[`InfPoint${key}`] = this.infiltrationPoints[key];
    }
  }

  /**
   * Cancel the test and clear all verifications.
   */
  private cancelTest(): void {
    this.clearTestParams();
  }

  /**
   * Clear all test parameters.
   */
  private clearTestParams(): void {
    for (const key of this.testKeys) {
      this.storage.remove(key);
    }

    this.tests().forEach((test) => {
      test.status = 'pending';
      test.infiltrationPoints = {};
    });

    this.setCabin('');
    this.setChassis('');
    this.platform = Platform.None;
    this.infiltrationPoints = {};
    this.tests.set([...this.tests()]);
    this.qtyVerificationsChanged.emit(0);
    this.recipeChanged.emit({} as Recipe);
  }

  /**
   * Add an infiltration point to the infiltration points object.
   * @param key The key of the infiltration point
   * @param value The value of the infiltration
   */
  private addInfiltrationPoint(key: number, value: boolean): void {
    this.infiltrationPoints[key] = value;
  }

  /**
   * - Process the verification of the infiltration test.
   * - Update the test properties every time a verification is completed.
   * @param testId - The id of the test
   * @param infiltrationTest - The infiltration test object
   */
  public processVerification(testId: string, infiltrationTest: InfiltrationTest): void {
    Object.entries(infiltrationTest.infiltrationPoints!).forEach(([key, value]) => {
      this.addInfiltrationPoint(Number(key), value || false);
      this.updateInfiltraionPoints();
    });
    this.updateQtyVerificationsCompleted();
    this.updateTestResult(testId, infiltrationTest);
  }

  /**
   * - Update the test result based on the infiltration test.
   * - If the infiltration test has any NOK point, the test result is NOK.
   * @param testId - The id of the test
   * @param infiltrationTest - The infiltration test object
   */
  private updateTestResult(testId: string, infiltrationTest: InfiltrationTest): void {
    for (const test in infiltrationTest) {
      const key = Number(test);
      if (infiltrationTest.infiltrationPoints![key]) {
        this.tests().find((t) => t.id === testId)!.result = 'NOK';
        break;
      }
    }
  }
}
