import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

// Services
import { CartService, CartItem, CartView } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule,
    DividerModule,
    RippleModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartView$: Observable<CartView | null>;
  private subscriptions: Subscription[] = [];
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.cartView$ = this.cartService.cartView$;
  }

  ngOnInit(): void {
    console.log('Cart component initialized');
    
    // Check authentication status
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Authentication status:', this.isAuthenticated);
    
    if (this.isAuthenticated) {
      // Refresh cart data
      this.cartService.getCartView().subscribe({
        next: (cartView) => console.log('Cart view loaded:', cartView),
        error: (err) => console.error('Error loading cart view:', err)
      });
      console.log('Cart refresh requested');
    } else {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
    }
    
    // Subscribe to auth changes
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.isAuthenticated = !!user;
        console.log('Auth status changed:', this.isAuthenticated);
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('Cart component destroyed');
  }

  updateQuantity(item: CartItem, newQuantity: string | number | null): void {
    // Convert to number and ensure it's at least 1
    const quantity = Math.max(1, Number(newQuantity) || 1);
    
    console.log(`Updating quantity for ${item.product.name} to ${quantity}`);
    
    this.cartService.updateItemQuantity(item.id, quantity)
      .subscribe({
        next: (updatedItem) => {
          console.log('Item quantity updated successfully', updatedItem);
          this.messageService.add({
            severity: 'success',
            summary: 'Quantity Updated',
            detail: `${item.product.name} quantity updated to ${quantity}`
          });
        },
        error: (error) => {
          console.error('Error updating item quantity', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Failed to update quantity. Please try again.'
          });
        }
      });
  }

  confirmRemove(item: CartItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${item.product.name} from your cart?`,
      accept: () => {
        this.removeItem(item);
      }
    });
  }

  removeItem(item: CartItem): void {
    console.log(`Removing item ${item.product.name} from cart`);
    
    this.cartService.removeItem(item.id)
      .subscribe({
        next: () => {
          console.log('Item removed successfully');
          this.messageService.add({
            severity: 'success',
            summary: 'Item Removed',
            detail: `${item.product.name} has been removed from your cart`
          });
        },
        error: (error) => {
          console.error('Error removing item', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Remove Failed',
            detail: 'Failed to remove item. Please try again.'
          });
        }
      });
  }

  checkout(): void {
    console.log('Proceeding to checkout');
    
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Checkout',
      detail: 'Proceeding to checkout...'
    });
  }
} 