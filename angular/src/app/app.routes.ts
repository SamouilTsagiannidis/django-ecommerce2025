import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { LayoutComponent } from './layout/layout.component';
import { CartComponent } from './pages/cart/cart.component';
// Import your dashboard/home component when created
// import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // Routes outside the main layout
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes within the main layout
  {
    path: '', // Base path for layout routes
    component: LayoutComponent,
    children: [
      // Cart route
      { path: 'cart', component: CartComponent },

      // Example dashboard route - uncomment and adapt when created
      // { path: 'dashboard', component: DashboardComponent },

      // Redirect base path within layout to dashboard (or cart/desired landing page)
      { path: '', redirectTo: 'cart', pathMatch: 'full' }, // Redirect empty layout path to cart for now
    ]
  },

  // Catch-all for unknown routes - redirect to login (if not logged in) or dashboard/cart (if logged in)
  // Catch-all needs refinement with AuthGuard
  { path: '**', redirectTo: '/login' }
];
