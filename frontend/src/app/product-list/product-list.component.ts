import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ProductService } from '../product.service';
import { CarouselModule } from 'primeng/carousel';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, CarouselModule,ButtonModule,],
  providers: [ProductService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  responsiveOptions: any[] | undefined;
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });

        this.responsiveOptions = [
          {
              breakpoint: '1400px',
              numVisible: 2,
              numScroll: 1
          },
          {
              breakpoint: '1199px',
              numVisible: 3,
              numScroll: 1
          },
          {
              breakpoint: '767px',
              numVisible: 2,
              numScroll: 1
          },
          {
              breakpoint: '575px',
              numVisible: 1,
              numScroll: 1
          }
      ]
    }


    
  }
  

