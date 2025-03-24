import { Component, Input } from '@angular/core';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-product',
  template: '',
})
export class ProductComponent {
  @Input() product: any;

  constructor(private cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.product.id).subscribe({
      next: (response) => alert('Product added to cart'),
      error: (error) => alert('Error adding to cart'),
    });
  }
}
