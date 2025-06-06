import { DatePipe } from '@angular/common';
import { IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OperationService } from 'src/app/services/operation/operation.service';
import { Operation } from 'src/app/types/operation.type';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit {
  public operations: Operation[] = [];
  public searchTerm: string = '';
  public hasError = false;
  public errorMessage = '';
  public currentPage = 1;
  public itemsPerPage = 6;
  public displayedOperations: Operation[] = [];

  constructor(
    private operationService: OperationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllOperations();
  }

  async loadAllOperations() {
    try {
      this.operations = await this.operationService.retrieveAllOperations();
      this.updateDisplayedOperations();
    } catch (error) {
      this.hasError = true;
      console.error('Erro ao carregar operações:', error);
    }
  }

  openOperation(operationId: string) {
    this.router.navigate(['/main/test-result'], { queryParams: { id: operationId } });
  }

  updateDisplayedOperations() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedOperations = this.operations.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedOperations();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.operations.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateDisplayedOperations();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.operations.length / this.itemsPerPage);
  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      this.loadAllOperations().then(() => {
        event.target.complete();
      });
    }, 2000);
  }

  search() {
    if (this.searchTerm) {
      this.displayedOperations = this.operations.filter(op =>
        op.Vp.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        op.Cabin.toLowerCase().includes(this.searchTerm.toLowerCase())
      ).slice(0, this.itemsPerPage);
      this.currentPage = 1;
    } else {
      this.updateDisplayedOperations();
    }
  }
}
