import { Component } from '@angular/core';
import { TopFooterComponent } from '../top-footer/top-footer.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductListComponent } from '../product-list/product-list.component'
@Component({
  selector: 'app-landing',
  standalone: true,  // This defines it as a standalone component
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports:[TopFooterComponent, FooterComponent, ProductListComponent]
})
export class LandingComponent {


  shopNow() {
    console.log('Navigating to shop...');
    // Add navigation logic here if necessary
  }
}
