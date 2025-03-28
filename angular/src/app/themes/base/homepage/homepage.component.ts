import { Component } from '@angular/core';
import { TopbarWidget } from '../../../shared/components/topbar/topbar.component'
import { CartComponent } from "../../../shared/components/cart/cart.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { CarouselComponent } from "../../../shared/components/carousel/carousel.component"
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TopbarWidget, CarouselComponent, FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
