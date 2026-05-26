import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-overlay" *ngIf="loading.loading$ | async">
      <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }
  `],
})
export class LoadingSpinnerComponent {
  constructor(public loading: LoadingService) {}
}
