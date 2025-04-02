import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, of, throwError, catchError, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Product } from './product.service'; // Assuming you have a Product interface

// Define interfaces for Cart and CartItem based on your Django serializers

export interface CartItem {
  id: number; // Primary key of the CartItem itself
  product: Product; // Use a specific Product interface
  quantity: number;
  price?: number; // Price of the product when added (optional)
  item_total?: number; // Optional: Calculated by backend (quantity * price)
}

export interface Cart {
  id?: number; // Cart might not have an ID if it's implicitly the user's
  items: CartItem[];
  total_price?: number; // Optional: Calculated by backend
}

// New interface for the enhanced cart view response
export interface CartView {
  cart: Cart;
  item_count: number;
  is_empty: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Base API URL from environment
  private baseApiUrl = environment.apiUrl;
  private cartUrl = `${this.baseApiUrl}/cart/`; // Unified URL for the ViewSet
  private viewCartUrl = `${this.cartUrl}view/`; // URL for the enhanced view_cart endpoint

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();
  
  // New BehaviorSubject for the enhanced cart view
  private cartViewSubject = new BehaviorSubject<CartView | null>(null);
  cartView$ = this.cartViewSubject.asObservable();
  
  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) {
    console.log('[CartService] Constructor called.'); // Keep or add for debugging if needed
  }
  
  // Helper to get HTTP headers with Authorization
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }
    return headers;
  }

  // Create an empty cart for use when API fails
  private createEmptyCart(): Cart {
    return {
      id: 0, // Temporary ID
      items: [],
      total_price: 0
    };
  }

  // Create an empty cart view for use when API fails
  private createEmptyCartView(): CartView {
    return {
      cart: this.createEmptyCart(),
      item_count: 0,
      is_empty: true,
      message: 'Your cart is empty.'
    };
  }

  // Fetch the user's current cart
  getCart(): Observable<Cart | null> {
    // *** Assumption: GET to cartUrl (`/api/cart/`) returns the current user's cart.
    // *** Adjust URL if backend uses `/api/my-cart/` or similar.
    console.log('Attempting to fetch cart from:', this.cartUrl);
    
    // Add explicit Authorization header
    const headers = this.getAuthHeaders();
    
    return this.http.get<Cart>(this.cartUrl, { headers }).pipe(
        tap(cart => {
            console.log('Cart fetched successfully:', cart);
            this.cartSubject.next(cart);
        }),
        catchError(error => {
            // Improved error handling with more details
            console.error('Error fetching cart:', error);
            if (error.status === 500) {
                console.warn('Server error (500) encountered while fetching cart. The backend may have an issue.');
                // Use empty cart instead of null for better UX
                const emptyCart = this.createEmptyCart();
                this.cartSubject.next(emptyCart);
                return of(emptyCart);
            } else if (error.status === 401) {
                console.warn('Authentication error (401) encountered. Token may be invalid or missing.');
            }
            
            this.cartSubject.next(null);
            return of(null);
        })
    );
  }

  // New method to fetch the enhanced cart view
  getCartView(): Observable<CartView | null> {
    console.log('Attempting to fetch enhanced cart view from:', this.viewCartUrl);
    
    // Add explicit Authorization header
    const headers = this.getAuthHeaders();
    
    return this.http.get<CartView>(this.viewCartUrl, { headers }).pipe(
        tap(cartView => {
            console.log('Enhanced cart view fetched successfully:', cartView);
            this.cartViewSubject.next(cartView);
            // Also update the regular cart subject
            this.cartSubject.next(cartView.cart);
        }),
        catchError(error => {
            console.error('Error fetching enhanced cart view:', error);
            if (error.status === 500) {
                console.warn('Server error (500) encountered while fetching cart view. The backend may have an issue.');
                // Use empty cart view instead of null for better UX
                const emptyCartView = this.createEmptyCartView();
                this.cartViewSubject.next(emptyCartView);
                return of(emptyCartView);
            } else if (error.status === 401) {
                console.warn('Authentication error (401) encountered. Token may be invalid or missing.');
            }
            
            this.cartViewSubject.next(null);
            return of(null);
        })
    );
  }

  // Add an item to the cart
  // *** Now uses POST to the base cartUrl (`/api/cart/`) handled by perform_create.
  addToCart(productId: number, quantity: number = 1): Observable<CartItem | null> {
    console.log(`Attempting to add product ${productId} (qty: ${quantity}) to cart via POST to:`, this.cartUrl);
    
    // Add explicit Authorization header
    const headers = this.getAuthHeaders();
    
    // Backend perform_create expects product_id and quantity
    return this.http.post<CartItem>(this.cartUrl, { product_id: productId, quantity }, { headers }).pipe(
        tap((addedOrUpdatedItem) => { // Note: backend might return the updated item if quantity was increased
            console.log('Item added/updated successfully:', addedOrUpdatedItem);
            this.refreshCart();
        }),
        catchError(error => {
            console.error('Error adding item to cart:', error);
            return throwError(() => error);
        })
    );
  }

  // Update item quantity in the cart
  // *** Assumption: PATCH to cartUrl + itemId (`/api/cart/{itemId}/`) updates quantity.
  // *** `itemId` must be the PK of the CartItem, not the Product ID.
  updateItemQuantity(itemId: number, quantity: number): Observable<CartItem | null> {
    const url = `${this.cartUrl}${itemId}/`;
    console.log(`Attempting to update item ${itemId} (qty: ${quantity}) via PATCH to:`, url);
    
    // Add explicit Authorization header
    const headers = this.getAuthHeaders();
    
    return this.http.patch<CartItem>(url, { quantity }, { headers }).pipe(
        tap((updatedItem) => {
            console.log('Item updated successfully:', updatedItem);
            this.refreshCart(); // Refresh cart state after updating
        }),
        catchError(error => {
            console.error('Error updating item quantity:', error);
            return throwError(() => error);
        })
    );
  }

  // Remove an item from the cart
  // *** Assumption: DELETE to cartUrl + itemId (`/api/cart/{itemId}/`) removes the item.
  // *** `itemId` must be the PK of the CartItem, not the Product ID.
  removeItem(itemId: number): Observable<any> {
    const url = `${this.cartUrl}${itemId}/`;
    console.log(`Attempting to remove item ${itemId} via DELETE to:`, url);
    
    // Add explicit Authorization header
    const headers = this.getAuthHeaders();
    
    return this.http.delete(url, { headers }).pipe(
        tap(() => {
            console.log(`Item ${itemId} removed successfully.`);
            this.refreshCart(); // Refresh cart state after removing
        }),
        catchError(error => {
            console.error('Error removing item from cart:', error);
            return throwError(() => error);
        })
    );
  }

  // Helper to refresh the cart state after modification
  private refreshCart() {
    if (this.authService.isAuthenticated()) {
        console.log('[CartService] User is authenticated, refreshing cart');
        // Use the enhanced cart view instead of the basic cart
        this.getCartView().pipe(take(1)).subscribe({
          next: (cartView) => console.log('[CartService] Cart refreshed successfully:', cartView?.item_count || 0, 'items'),
          error: (err) => console.error('[CartService] Error refreshing cart:', err)
        });
    } else {
        console.log('[CartService] Not refreshing cart - user not authenticated');
        // Clear local cart state when not authenticated
        this.clearLocalCart();
    }
  }

  // Clear local cart state (called by authService subscription on logout)
  clearLocalCart() {
      console.log('[CartService] Clearing local cart state');
      this.cartSubject.next(null);
      this.cartViewSubject.next(null);
  }
}
