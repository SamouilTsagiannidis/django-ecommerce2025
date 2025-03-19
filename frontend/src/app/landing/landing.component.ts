import { Component } from '@angular/core';
import { TopFooterComponent } from '../top-footer/top-footer.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,  // This defines it as a standalone component
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports:[TopFooterComponent, FooterComponent]
})
export class LandingComponent {
  products = [
    { name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/150' },
    { name: 'Product 2', price: 49.99, image: 'https://via.placeholder.com/150' },
    { name: 'Product 3', price: 19.99, image: 'https://via.placeholder.com/150' }
  ];

  shopNow() {
    console.log('Navigating to shop...');
    // Add navigation logic here if necessary
  }
}
