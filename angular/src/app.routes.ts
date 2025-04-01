import { Routes } from '@angular/router';
import { HomepageComponent } from './app/themes/base/homepage/homepage.component';
import { ProductsviewComponent } from './app/themes/base/productsview/productsview.component';
import { LoginComponent } from './app/shared/components/login/login.component';
import { RegisterComponent } from './app/shared/components/register/register.component';

export const appRoutes: Routes = [
    {path: '', component: HomepageComponent,},
    {path: 'products', component: ProductsviewComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },  // Catch all route - redirect to login instead of 404
    { path: '**', redirectTo: '/notfound' }
];
