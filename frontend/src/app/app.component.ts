import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-loading-spinner></app-loading-spinner>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class AppComponent {}
