import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Result, TestResult } from 'src/app/types/testResult.type';
import { ActivatedRoute, Router } from '@angular/router';
import { PrinterService } from 'src/app/services/printer/printer.service';
import { addIcons } from 'ionicons';
import { chevronForwardCircle, print, save } from 'ionicons/icons';
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

@Component({
  imports: [IonicModule],
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.scss'],
})
export class TestResultComponent implements OnInit {
  @Input() testResult: TestResult = {} as TestResult;
  @Input() operationId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private operationService: OperationService,
    private recipeService: RecipeService,
    private userService: UserService,
    private printerService: PrinterService,
    private router: Router
  ) {
    this.operationId = this.activatedRoute.snapshot.queryParamMap.get('id') as string;
    addIcons({ chevronForwardCircle, print, save });
  }

  ngOnInit() {
    this.setTestResult();
  }

  async setTestResult() {
    if (this.operationId) {
      Promise.all([
        await this.operationService.retrieveOperationById(this.operationId),
        await this.operationService.retrieveOperationById(this.operationId)
          .then(async (operation) =>
            await this.recipeService.retrieveRecipeById(operation.Recipe)),
        await this.operationService.retrieveOperationById(this.operationId)
          .then(async (operation) =>
            await this.userService.getUserByBadgeNumber(operation.Operator)),
      ]).then(([operation, recipe, user]) => {
        const createdAt = new Date(operation.CreatedAt!);
        this.testResult = {
          operationId: operation.OperationId!,
          van: operation.Van,
          description: recipe.Description,
          status: operation.Status,
          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString(),
          duration: operation.Duration!,
          operator: user.UserName,
          upsideTestResult: this.getTestResult('upside', operation),
          frontsideTestResult: this.getTestResult('frontside', operation),
          backsideTestResult: this.getTestResult('backside', operation),
          leftsideTestResult: this.getTestResult('leftside', operation),
          rightsideTestResult: this.getTestResult('rightside', operation),
        }
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
        points = UpsideTestModel.points;
        break;
      case 'frontside':
        points = FrontsideTestModel.points;
        break;
      case 'backside':
        points = BacksideTestModel.points;
        break;
      case 'leftside':
        points = LeftsideTestModel.points;
        break;
      case 'rightside':
        points = RightsideTestModel.points;
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

  reprint() {
    this.printerService.printTestResult(this.testResult);
  }

  finalize() {
    this.router.navigate(['main/run']);
  }
}
