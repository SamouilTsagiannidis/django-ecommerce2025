import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { CartService, Cart, CartItem } from '../../shared/services/cart.service'; // Adjust path
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber'; // For quantity updates
import { FormsModule } from '@angular/forms'; // For ngModel on inputnumber

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
    ButtonModule,
    RippleModule,
    InputNumberModule, // Add InputNumberModule
    FormsModule // Add FormsModule
  ],
  template: `
    <div class="card p-4">
      <h2>Shopping Cart</h2>
      <ng-container *ngIf="cart$ | async as cart; else loadingOrEmpty">
        <div *ngIf="cart.items && cart.items.length > 0; else emptyCart">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b">
                <th class="text-left p-2">Product</th>
                <th class="text-left p-2">Price</th>
                <th class="text-center p-2">Quantity</th>
                <th class="text-right p-2">Total</th>
                <th class="p-2"></th> <!-- Actions -->
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of cart.items" class="border-b">
                <td class="p-2 flex items-center">
                  <img [src]="item.product?.main_image || 'assets/placeholder.png'" [alt]="item.product?.name" class="w-16 h-16 object-cover mr-3">
                  <span>{{ item.product?.name || 'Product Name Missing' }}</span>
                </td>
                <td class="p-2">{{ item.product?.price | currency:'USD' }}</td>
                <td class="p-2 text-center">
                  <!-- Use p-inputNumber for quantity -->
                  <p-inputNumber
                    [(ngModel)]="item.quantity"
                    [min]="1"
                    [max]="item.product?.stock || 99"
                    [style]="{'width': '5rem'}"
                    (onInput)="updateQuantity(item, $event.value)"
                    mode="decimal" [showButtons]="true">
                  </p-inputNumber>
                </td>
                <td class="p-2 text-right">{{ (item.quantity * (item.product?.price || 0)) | currency:'USD' }}</td>
                <td class="p-2 text-center">
                  <button pButton pRipple icon="pi pi-trash" class="p-button-danger p-button-text" (click)="removeItem(item.id)"></button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-semibold">
                <td colspan="3" class="text-right p-2">Grand Total:</td>
                <td class="text-right p-2">{{ cart.total_price | currency:'USD' }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <div class="mt-4 text-right">
            <button pButton pRipple label="Proceed to Checkout" class="p-button-success"></button>
          </div>
        </div>
      </ng-container>

      <ng-template #loadingOrEmpty>
         <p>Loading cart...</p> 
         <!-- Add check for definitively empty cart after load if cart$ emits null initially -->
      </ng-template>

      <ng-template #emptyCart>
        <p>Your cart is empty.</p>
      </ng-template>
    </div>
  `,
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart | null>;
  private cartService = inject(CartService);

  constructor() {
    console.log('[CartComponent] Constructor called.'); // Log construction
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    console.log('[CartComponent] ngOnInit called.'); // Log init
    // You can log the cart value here too if needed
    this.cart$.subscribe(cart => console.log('[CartComponent] Cart state updated:', cart));
  }

  updateQuantity(item: CartItem, eventValue: string | number | null) {
    // Convert event value to number, defaulting to current quantity if invalid
    const newQuantity = typeof eventValue === 'number' ? eventValue : parseInt(eventValue || '', 10);

    // Check if conversion is valid and different from current
    if (isNaN(newQuantity) || newQuantity < 1 || newQuantity === item.quantity) {
      // If invalid or unchanged, potentially reset input or do nothing
      // For now, just log and return to avoid unnecessary API calls
      console.log('Invalid or unchanged quantity:', eventValue);
      // Optionally reset the input field value back to item.quantity if needed
      // item.quantity = item.quantity; // This might require a small delay or ChangeDetectorRef
      return;
    }

    console.log(`Updating item ${item.id} quantity to ${newQuantity}`);
    this.cartService.updateItemQuantity(item.id, newQuantity).subscribe({
      error: (err) => {
         console.error('Failed to update quantity', err);
         // Optionally revert quantity in the UI on error
         // item.quantity = item.quantity; // Revert (might need ChangeDetectorRef)
      }
    });
  }

  removeItem(itemId: number) {
    console.log(`Removing item ${itemId}`);
    this.cartService.removeItem(itemId).subscribe({
       error: err => console.error('Failed to remove item', err)
       // Success implicitly handled by cart$ update via refreshCart
    });
  }
} 