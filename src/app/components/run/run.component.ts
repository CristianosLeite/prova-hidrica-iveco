import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InfiltrationPointsComponent } from '../infiltration-points/infiltration-points.component';
import { MainService } from 'src/app/services/main/main.service';
import { Recipe } from 'src/app/types/recipe.type';
import { ScannerComponent } from '../scanner/scanner.component';
import { LoadedRecipeModalComponent } from "../loaded-recipe-modal/loaded-recipe-modal.component";
import { Operation } from 'src/app/types/operation.type';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiService } from 'src/app/services/api/api.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DeviceSelectionComponent } from '../device-selection/device-selection.component';
import { Platform } from 'src/app/types/device.type';

@Component({
  imports: [
    IonicModule,
    FormsModule,
    InfiltrationPointsComponent,
    ScannerComponent,
    LoadedRecipeModalComponent,
    DeviceSelectionComponent
  ],
  selector: 'app-run',
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss'],
})
export class RunComponent implements OnInit {
  public recipe: Recipe = {} as Recipe;
  public qtyVerifications: number = 0;
  public qtyTests: number = this.mainService.getQtyTests();

  public progress = 0;
  public buffer = 0.06;
  public isLoading = false;

  public toast = false;
  public toastMessage = '';

  public isDeviceSelected = signal(false);
  public selectedDevice = signal('none');
  public activeDevice = signal('none');

  public alertButtons = [
    {
      text: 'Sim',
      role: 'confirm',
      handler: async () => {
        if (this.qtyVerifications < this.qtyTests) {
          await this.cancelTest();
        } else {
          await this.completeFinishTest();
        }
      },
    },
    {
      text: 'Não',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
  ];

  private operation: Operation = {} as Operation;

  constructor(
    private mainService: MainService,
    private authService: AuthService,
    private apiService: ApiService,
    private deviceService: DeviceService
  ) { }

  async ngOnInit() {
    this.isDeviceSelected.set(false);
    this.selectedDevice.set('none');
    this.mainService.qtyVerificationsChanged.subscribe((qty: number) => {
      this.qtyVerifications = qty;
    });
    this.mainService.recipeChanged.subscribe((recipe: Recipe) => {
      this.recipe = recipe;
      this.operation.Recipe = this.recipe.RecipeId!;
      this.operation.Vp = this.recipe.Vp;
    });
    this.operation.Operator = this.authService.getLoggedUser().BadgeNumber;
    await this.deviceService.getDeviceInfo().then((deviceInfo) => {
      this.activeDevice.set(deviceInfo.platform);
    });
    if (this.mainService.getPlatform() !== 'none') {
      this.selectedDevice.set(this.mainService.getPlatform());
      this.isDeviceSelected.set(true);
    }
  }

  async finishTest() {
    if (this.qtyVerifications < this.qtyTests) {
      return;
    }

    // Check for insufficient duration
    if (this.hasInsufficientDuration()) {
      // Show duration warning alert (handled by template)
      return;
    }

    // If duration is ok, proceed with test completion
    await this.completeFinishTest();
  }

  hasInsufficientDuration(): boolean {
    return this.mainService.hasInsufficientDuration();
  }

  async completeFinishTest() {
    setInterval(() => {
      this.progress += 0.01;

      // Reset the progress bar when it reaches 100%
      // to continuously show the demo
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);

    this.isLoading = true;
    await this.mainService.stop('finish', this.operation).then(async (operation) => {
      if (operation) {
        this.progress = 1;
        this.isLoading = false;
        this.toast = true;
        this.toastMessage = 'Operação finalizada com sucesso!';
      }
    }).catch(() => {
      this.isLoading = false;
      this.toast = true;
      this.toastMessage = 'Erro ao finalizar a operação!';
    });

    await this.apiService.stopOperation();

    const platform = (await this.deviceService.getDeviceInfo()).platform;
    if (platform === 'mobile') await this.apiService.openDoor();

    await this.apiService.doorClosed().then(() => {
      this.isDeviceSelected.set(false);
      this.selectedDevice.set('none');
    });
    this.toast = false;
  }

  async cancelTest() {
    await this.mainService.stop('cancel');
    await this.apiService.stopOperation();
    await this.apiService.finishOperation();
  }

  setSelectedPlatform(platform: Platform) {
    this.selectedDevice.set(platform);
    this.isDeviceSelected.set(true);

    if (platform === 'mobile') {
      this.apiService.openDoor();
      this.apiService.listenUnAuthentication(false);
    }

    if (platform === 'none') {
      this.deviceService.getDeviceInfo().then((deviceInfo) => {
        this.activeDevice.set(deviceInfo.platform);
        this.mainService.setPlatform(deviceInfo.platform as Platform);
      });
      return;
    }

    this.mainService.setPlatform(platform);
  }
}
