import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Result, TestResult } from 'src/app/types/testResult.type';
import { ActivatedRoute } from '@angular/router';
import { PrinterService } from 'src/app/services/printer/printer.service';
import { OperationService } from 'src/app/services/operation/operation.service';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { UserService } from 'src/app/services/user/user.service';
import { Operation } from 'src/app/types/operation.type';
import { Point } from 'src/app/types/point.type';
import UpsideTestModel from 'src/app/models/upside-test.model';
import FrontsideTestModel from 'src/app/models/frontside-test.model';
import BacksideTestModel from 'src/app/models/backside-test.model';
import LeftsideTestModel from 'src/app/models/leftside-test.model';
import RightsideTestModel from 'src/app/models/rightside-test.model';
import { InfiltrationTest } from 'src/app/types/infiltrationTest.type';

/**
 * This component displays the test result of a specific operation.
 */
@Component({
  imports: [IonicModule],
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss'],
})
export class TestResultComponent implements OnInit {
  public testResult: TestResult = {} as TestResult;
  public operationId: string = '';
  private operation: Operation | undefined = undefined;

  public tests: InfiltrationTest[] = [
    UpsideTestModel,
    FrontsideTestModel,
    BacksideTestModel,
    LeftsideTestModel,
    RightsideTestModel,
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private operationService: OperationService,
    private recipeService: RecipeService,
    private userService: UserService,
    private printerService: PrinterService
  ) {
    this.operationId = this.activatedRoute.snapshot.queryParamMap.get('id') as string;
  }

  ngOnInit() {
    this.setTestResult();
  }

  /**
   * This method retrieves the operation, recipe, and user objects from the database and sets the test result.
   */
  async setTestResult() {
    if (this.operationId) {
      //       const operation = await this.operationService.retrieveOperationById(
      //         this.operationId
      //       );
      //       console.log('Operation:', operation);
      //       const [recipe, user] = await Promise.all([
      //         this.recipeService.retrieveRecipeById(operation.Recipe),
      //         this.userService.getUserByBadgeNumber(operation.Operator),
      //       ]);

      //       const createdAt = new Date(operation.CreatedAt!);
      //       this.testResult = {
      //         operationId: operation.OperationId!,
      //         van: operation.Van,
      //         description: recipe.Description,
      //         status: operation.Status,
      //         date: createdAt.toLocaleDateString(),
      //         time: createdAt.toLocaleTimeString(),
      //         duration: operation.Duration!,
      //         operator: `${user.BadgeNumber} - ${user.UserName}`,
      //         upsideTestResult: this.getTestResult('upside', operation),
      //         frontsideTestResult: this.getTestResult('frontside', operation),
      //         backsideTestResult: this.getTestResult('backside', operation),
      //         leftsideTestResult: this.getTestResult('leftside', operation),
      //         rightsideTestResult: this.getTestResult('rightside', operation),
      //       };
      Promise.all([
        await this.operationService.retrieveOperationById(this.operationId),
        await this.operationService.retrieveOperationById(this.operationId)
          .then(async (operation) =>
            await this.recipeService.retrieveRecipeById(operation.Recipe)),
        await this.operationService.retrieveOperationById(this.operationId)
          .then(async (operation) =>
            // The operator is stored as a badge number in the operation object.
            // We need to retrieve the user object to get the operator's name.
            await this.userService.getUserByBadgeNumber(operation.Operator)),
      ]).then(([operation, recipe, user]) => {
        this.operation = operation;
        const createdAt = new Date(operation.CreatedAt!);
        this.testResult = {
          operationId: operation.OperationId!,
          vp: operation.Vp || 'Não informado',
          cabin: operation.Cabin || 'Não informado',
          chassis: operation.Chassis || 'Não informado',
          description: recipe.Description,
          status: operation.Status,
          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString(),
          duration: operation.Duration!,
          operator: `${user.BadgeNumber} - ${user.UserName}`,
          upsideTestResult: this.getTestResult('upside', operation),
          frontsideTestResult: this.getTestResult('frontside', operation),
          backsideTestResult: this.getTestResult('backside', operation),
          leftsideTestResult: this.getTestResult('leftside', operation),
          rightsideTestResult: this.getTestResult('rightside', operation),
        };
      });
    }
  }

  getTestResult(testId: string, operation: Operation): Result {
    // Each operation returned from the database contains infiltration points named InfPoint plus the key of each point. Example: InfPoint1, InfPoint2, InfPoint3, etc.
    // To be considered approved (OK), the value of all infiltration points must be false (There is no infiltration).
    // To be considered disapproved (NOK), the value of at least one infiltration point must be true (There is infiltration).

    let points: Point[];
    switch (testId) {
      case 'upside':
        points = this.tests[0].points; // UpsideTestModel
        break;
      case 'frontside':
        points = this.tests[1].points; // FrontsideTestModel
        break;
      case 'backside':
        points = this.tests[2].points; // BacksideTestModel
        break;
      case 'leftside':
        points = this.tests[3].points; // LeftsideTestModel
        break;
      case 'rightside':
        points = this.tests[4].points; // RightsideTestModel
        break;
      default:
        points = [];
        break;
    }

    // Get the value of each infiltration point
    const infPoints = points.map(point => operation[`InfPoint${point.id}`]);

    // If at least one infiltration point is true, the test result is NOK. Otherwise, it is OK.
    return infPoints.includes(true) ? 'NOK' : 'OK';
  }

  /**
   * This method is called when the user clicks the print button.
   * Avoid calling async methods directly in the template.
   */
  print() {
    this.sendToPrinter();
  }

  /**
   * This method sends asynchronously the test result to the printer.
   */
  async sendToPrinter() {
    await this.printerService.printTestResult(this.testResult, this.operation);
  }
}
