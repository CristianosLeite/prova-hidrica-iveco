import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/types/recipe.type';
import { IonModal } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MainService } from 'src/app/services/main/main.service';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  imports: [
    IonicModule,
    DatePipe
  ],
  selector: 'app-loaded-recipe-modal',
  templateUrl: './loaded-recipe-modal.component.html',
  styleUrls: ['./loaded-recipe-modal.component.scss'],
})
export class LoadedRecipeModalComponent  implements OnInit, AfterViewInit {
  @Input() public recipe: Recipe | null = null;

  presentingElement!: HTMLElement | null;
  @ViewChild(IonModal) modal!: IonModal;

  public operator = '';
  public startTime = '';
  public cis = '';

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.operator = this.authService.getLoggedUser().UserName;
    this.startTime = this.mainService.getStartTime();
    this.cis = this.mainService.getCis();
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  handleSprinklerHeight(height: number): string {
    return height === 1 ? 'Alta' : height === 2 ? 'Média' : 'Baixa';
  }

  startOperation() {
    this.modal.dismiss();
    this.apiService.enableOperation();
  }
}
