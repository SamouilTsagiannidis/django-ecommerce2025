import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LandingComponent } from './landing/landing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
  <app-landing></app-landing>
  `,
  imports: [ButtonModule,LandingComponent]
})
export class AppComponent {}
