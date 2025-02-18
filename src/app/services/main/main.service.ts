import { EventEmitter, Injectable, Output, signal, WritableSignal } from '@angular/core';
import { IMainApplication } from 'src/app/interfaces/IMainApplication.inteface';
import { InfiltrationPoints } from 'src/app/types/infiltrationPoints.type';
import { InfiltrationTest } from 'src/app/types/infiltrationTest.type';
import { Storage } from '@ionic/storage';
import { Recipe } from 'src/app/types/recipe.type';

@Injectable({
  providedIn: 'root'
})
export class MainService implements IMainApplication {
  public tests: WritableSignal<InfiltrationTest[]> = signal([
    { id: 'upside', title: 'Verificar teto', url: '/main/upside-test', img: '../../../assets/img/upside-truck.webp', testImg: '../../../assets/img/frontside-test.webp', altImg: 'Upside truck', content: 'Verificar parte superior da cabine', status: 'pending' },
    { id: 'frontside', title: 'Verificar frente da cabine', url: '/main/frontside-test', img: '../../../assets/img/front-truck.webp', testImg: '../../../assets/img/frontside-test.webp', altImg: 'Frontside truck', content: 'Verificar vãos do para-brisa e painel frontal', status: 'pending' },
    { id: 'backside', title: 'Verificar traseira da cabine', url: '/main/backside-test', img: '../../../assets/img/back-truck.webp', testImg: '../../../assets/img/backside-test.webp', altImg: 'Backside truck', content: 'Verificar tampões do teto posterior', status: 'pending' },
    { id: 'leftside', title: 'Verificar lado esquerdo da cabine', url: '/main/leftside-test', img: '../../../assets/img/left-truck.webp', testImg: '../../../assets/img/leftside-test.webp', altImg: 'Leftside truck', content: 'Verificar vãos da lateral esquerda', status: 'pending' },
    { id: 'rightside', title: 'Verificar lado direito da cabine', url: '/main/rightside-test', img: '../../../assets/img/right-truck.webp', testImg: '../../../assets/img/rightside-test.webp', altImg: 'Rightside truck', content: 'Verificar vãos da lateral direita', status: 'pending' },
  ]);
  qtyTests: number = this.tests().length;
  infiltrationPoints: InfiltrationPoints = {};

  @Output() qtyVerificationsChanged: EventEmitter<number> = new EventEmitter();
  @Output() recipeChanged: EventEmitter<Recipe> = new EventEmitter();

  constructor(
    private storage: Storage
  ) { }

  async initializeTests() {
    const testKeys = ['upside', 'frontside', 'backside', 'leftside', 'rightside'];
    try {
      for (const key of testKeys) {
        await this.storage.get(key).then((test) => {
          if (test) {
            const index = testKeys.indexOf(key);
            this.tests()[index] = test;
          }
        });
      }
      this.tests.set([...this.tests()]);
      this.updateQtyTestsCompleted();
      this.updateInfiltraionPoints();
    } catch (error) {
      console.error(error);
    }
  }

  private updateQtyTestsCompleted(): void {
    const qty = this.tests().filter((test) => test.status === 'completed').length;
    this.qtyVerificationsChanged.emit(qty);
  }

  private updateInfiltraionPoints(): void {
    this.infiltrationPoints = this.tests().reduce((acc, test) => {
      if (test.status === 'completed') {
        return { ...acc, ...test.testResult };
      }
      return acc;
    }, {});
  }

  public start(): void {
    this.qtyVerificationsChanged.emit(this.qtyTests);
    this.infiltrationPoints = {};
    console.log('Service started');
  }

  public stop(): void {
    console.log('Service stopped');
  }

  public finish(): void {
    this.clearVerifications();
    console.log('Service finished');
  }

  public cancelTest(): void {
    this.clearVerifications();
    console.log('Test canceled');
  }

  private clearVerifications(): void {
    const testKeys = ['upside', 'frontside', 'backside', 'leftside', 'rightside'];
    for (const key of testKeys) {
      this.storage.remove(key);
    }
    this.tests().forEach((test) => {
      test.status = 'pending';
      test.testResult = {};
    });

    this.tests.set([...this.tests()]);
    this.qtyVerificationsChanged.emit(0);
  }

  private addInfiltrationPoint(key: number, value: boolean): void {
    this.infiltrationPoints[key] = value;
  }

  public processVerification(infiltrationPoints: InfiltrationPoints): void {
    Object.entries(infiltrationPoints).forEach(([key, value]) => {
      this.addInfiltrationPoint(Number(key), value || false);
    });
    this.updateQtyTestsCompleted();
  }

  public handleCodeBarsData(data: Recipe): void {
    console.log('Data read:', data);
    this.recipeChanged.emit(data);
  }
}
