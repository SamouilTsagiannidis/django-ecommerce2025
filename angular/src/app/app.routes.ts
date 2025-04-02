import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomepageComponent } from './themes/base/homepage/homepage.component';
import { AuthGuard } from './shared/guards/auth.guard';
// Import your dashboard/home component when created
// import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  // Routes outside the main layout
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Direct route to cart - protected with AuthGuard
  { 
    path: 'cart', 
    component: CartComponent, 
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },

  // Routes within the main layout
  {
    path: '', // Base path for layout routes
    component: HomepageComponent,
    children: [
      // Example dashboard route - uncomment and adapt when created
      // { path: 'dashboard', component: DashboardComponent },

      // Redirect base path within layout to home
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ]
  },

  // Catch-all for unknown routes - redirect to home
  { path: '**', redirectTo: '/' }
];
