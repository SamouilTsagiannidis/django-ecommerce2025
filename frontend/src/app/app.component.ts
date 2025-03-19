import { Component } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-product-list></app-product-list>
    <div class="card flex justify-center">
      <p-button label="Check" />
    </div>
  `,
  imports: [ProductListComponent, ButtonModule]
})
export class AppComponent {}
