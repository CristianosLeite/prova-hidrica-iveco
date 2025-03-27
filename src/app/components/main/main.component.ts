import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserComponent } from '../user/user.component';
import { EditUserComponent } from '../user/edit-user/edit-user.component';
import { SettingsComponent } from '../settings/settings.component';
import { ServerComponent } from '../settings/server/server.component';
import { PreferencesComponent } from '../settings/preferences/preferences.component';
import { ScannerComponent } from '../scanner/scanner.component';
import { DevicesComponent } from '../devices/devices.component';
import { DeviceConfigComponent } from '../settings/device-config/device-config.component';
import { RunComponent } from '../run/run.component';
import { InfiltrationPointsComponent } from '../infiltration-points/infiltration-points.component';
import { PointSelectionComponent } from '../infiltration-points/point-selection/point-selection.component';
import { RecipesComponent } from '../recipes/recipes.component';
import { EditRecipeComponent } from '../recipes/edit-recipe/edit-recipe.component';
import { OperationsComponent } from "../operations/operations.component";
import { TestResultComponent } from '../test-result/test-result.component';
import UpsideTestModel from 'src/app/models/upside-test.model';
import FrontsideTestModel from 'src/app/models/frontside-test.model';
import BacksideTestModel from 'src/app/models/backside-test.model';
import LeftsideTestModel from 'src/app/models/leftside-test.model';
import RightsideTestModel from 'src/app/models/rightside-test.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EditDeviceComponent } from "../devices/edit-device/edit-device.component";

@Component({
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    RunComponent,
    UserComponent,
    EditUserComponent,
    RecipesComponent,
    EditRecipeComponent,
    SettingsComponent,
    ServerComponent,
    PreferencesComponent,
    ScannerComponent,
    DevicesComponent,
    EditDeviceComponent,
    DeviceConfigComponent,
    InfiltrationPointsComponent,
    PointSelectionComponent,
    OperationsComponent,
    TestResultComponent
],
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public page!: string;
  public upsidePoints = UpsideTestModel.points;
  public frontsidePoints = FrontsideTestModel.points;
  public backsidePoints = BacksideTestModel.points;
  public leftsidePoints = LeftsideTestModel.points;
  public rightsidePoints = RightsideTestModel.points;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.page = this.activatedRoute.snapshot.paramMap.get('page') as string;
  }
}
