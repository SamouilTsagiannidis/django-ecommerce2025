import { Routes } from '@angular/router';
import { HomepageComponent } from './app/themes/base/homepage/homepage.component';
import { ProductsviewComponent } from './app/themes/base/productsview/productsview.component';
import { LoginComponent } from './app/shared/components/login/login.component';
import { RegisterComponent } from './app/shared/components/register/register.component';
import { CartComponent } from './app/pages/cart/cart.component';
import { AuthGuard } from './app/shared/guards/auth.guard';

export const appRoutes: Routes = [
    {path: '', component: HomepageComponent,},
    {path: 'products', component: ProductsviewComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {
      path: 'cart', 
      component: CartComponent,
      canActivate: [AuthGuard]
    },
];
