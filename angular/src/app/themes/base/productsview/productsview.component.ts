import { Component } from '@angular/core';
import { TopbarComponent } from '../../../shared/components/topbar/topbar.component'
import { CartComponent } from "../../../shared/components/cart/cart.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-productsview',
  imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, FooterComponent, TopbarComponent, DialogModule],
  templateUrl: './productsview.component.html',
  styleUrl: './productsview.component.scss',
  providers: [ProductService]
})


export class ProductsviewComponent {
  layout: 'grid' | 'list' = 'grid';
  options = ['list', 'grid'];
  products: Product[] = [];
  display: boolean = false;
  selectedProduct: Product | null = null;
  errors: boolean = false;
  text: string = 'Succesfully Added';
  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
      this.productService.getProductsSmall().subscribe((products: Product[]) => {
          this.products = products;
      });
  }

  addToCart(productId: number) {
      this.cartService.addToCart(productId).subscribe({
          error: () => this.text="Error"
      });
  }

  open(product: Product) {
      this.selectedProduct = product;
      this.display = true;
  }

  close() {
      this.display = false;
  }
}
