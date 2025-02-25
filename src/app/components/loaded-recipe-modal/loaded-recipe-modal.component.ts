import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/types/recipe.type';
import { IonModal } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  selector: 'app-loaded-recipe-modal',
  templateUrl: './loaded-recipe-modal.component.html',
  styleUrls: ['./loaded-recipe-modal.component.scss'],
})
export class LoadedRecipeModalComponent  implements OnInit, AfterViewInit {
  @Input() public recipe: Recipe | null = null;
  presentingElement!: HTMLElement | null;
  @ViewChild(IonModal) modal!: IonModal;

  constructor() { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  handleSprinklerHeight(height: number): string {
    return height === 1 ? 'Alta' : height === 2 ? 'Média' : 'Baixa';
  }
}
