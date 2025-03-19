import { Component } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ButtonModule } from 'primeng/button';
import { LandingComponent } from './landing/landing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <app-landing></app-landing>
  `,
  imports: [ProductListComponent, ButtonModule,LandingComponent]
})
export class AppComponent {}
