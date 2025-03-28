import { Routes } from '@angular/router';
import { HomepageComponent } from './app/themes/base/homepage/homepage.component';


export const appRoutes: Routes = [
    {path: '', component: HomepageComponent,},
    // {path: 'products', component: ProductsView},
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
