import { Component, computed, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { LayoutService } from '../shared/services/layout.service'; // TEMP: Comment out
import { TopbarComponent } from './topbar/topbar.component';
// import { ProductService, Product } from '../shared/services/product.service'; // TEMP: Comment out
// import { CartService } from '../shared/services/cart.service'; // TEMP: Comment out
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
// Create a placeholder Sidebar component if needed, or import the real one
// import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopbarComponent,
    // SidebarComponent // Import if created
    RouterModule, // Needed for routerLink in Topbar/Sidebar
    ButtonModule, // Add ButtonModule
    RippleModule // Add RippleModule
  ],
  // providers: [ProductService], // Remove if ProductService is providedIn: 'root'
  template: `
    <div>
        <h1>Layout Component Loaded!</h1>
        <app-topbar></app-topbar>
        <hr>
        <p>Router Outlet Below:</p>
        <router-outlet></router-outlet>
    </div>
  `,
  // Add styles if needed, potentially copied/adapted from frontend/src/app/layout/component/app.layout.scss
  // styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  // TEMP: Comment out properties using services
  // products$: Observable<Product[]> | undefined;
  // private productService = inject(ProductService);
  // private cartService = inject(CartService);
  // public layoutService = inject(LayoutService);

  constructor() {
      console.log('[LayoutComponent] Constructor called.');
  }

  ngOnInit(): void {
      console.log('[LayoutComponent] ngOnInit called.');
      // TEMP: Comment out service call
      // this.products$ = this.productService.getProductsData();
  }

  // TEMP: Comment out method using services
  // addItemToCart(product: Product) { ... }

  // TEMP: Comment out computed property using services
  // containerClass = computed(() => { ... });
} 