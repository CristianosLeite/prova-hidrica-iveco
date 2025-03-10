import { IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OperationService } from 'src/app/services/operation/operation.service';
import { Operation } from 'src/app/types/operation.type';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  public operations: Operation[] = [];
  public documentTextOutline = 'document-text-outline';
  public documentTextSharp = 'document-text-sharp';
  public searchTerm: string = '';
  public hasError = false;
  public errorMessage = '';
  public currentPage = 1;
  public itemsPerPage = 6;

  constructor(private operationService: OperationService) {}

  ngOnInit() {
    this.operationService
      .retrieveLastOperationsByAmount(6)
      .then((operations: Operation[]) => {
        this.operations = operations;
      });
  }

  search() {}

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      this.operationService
        .retrieveLastOperationsByAmount(6)
        .then((operations: Operation[]) => {
          this.operations = operations;
        })
        .then(() => {
          event.target.complete();
        });
    }, 2000);
  }
}
