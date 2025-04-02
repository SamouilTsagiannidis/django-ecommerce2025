import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterLink } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { CartService, CartView } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  imports: [
    RouterLink, 
    StyleClassModule, 
    ButtonModule, 
    RippleModule, 
    BadgeModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit, OnDestroy {
  router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  
  isAuthenticated = false;
  cartItemCount = 0;
  
  private authSubscription: Subscription | null = null;
  private cartSubscription: Subscription | null = null;

  constructor() {
    // Check authentication immediately in constructor
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('[TopbarComponent] Constructor - Initial auth state:', this.isAuthenticated);
  }

  ngOnInit(): void {
    // Check initial authentication state again in ngOnInit
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('[TopbarComponent] ngOnInit - Initial auth state:', this.isAuthenticated);
    
    // Subscribe to authentication changes
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = !!user || this.authService.isAuthenticated();
      console.log('[TopbarComponent] Auth subscription update:', { 
        wasAuthenticated, 
        isNowAuthenticated: this.isAuthenticated, 
        userExists: !!user,
        tokenExists: !!this.authService.getToken()
      });
      
      // If user is authenticated, get cart data
      if (this.isAuthenticated) {
        this.cartService.getCartView().subscribe();
      }
    });
    
    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartView$.subscribe(cartView => {
      if (cartView) {
        this.cartItemCount = cartView.item_count;
        console.log('[TopbarComponent] Cart item count updated:', this.cartItemCount);
      } else {
        this.cartItemCount = 0;
      }
    });
    
    // If authenticated, fetch cart data
    if (this.isAuthenticated) {
      console.log('[TopbarComponent] User is authenticated, fetching cart data');
      this.cartService.getCartView().subscribe({
        next: (cartView) => console.log('[TopbarComponent] Initial cart data loaded'),
        error: (err) => console.error('[TopbarComponent] Error loading initial cart data:', err)
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout(): void {
    console.log('[TopbarComponent] Logout method called');
    
    // Directly handle logout without API call to ensure it always works
    this.authService.handleLogout();
    
    // Clear cart data
    this.cartService.clearLocalCart();
    
    // Navigate to login page
    console.log('[TopbarComponent] Navigating to login page');
    this.router.navigate(['/login']).then(success => {
      console.log('[TopbarComponent] Navigation to login result:', success);
    });
  }

  navigateToCart(): void {
    console.log('[TopbarComponent] navigateToCart called, auth state:', this.isAuthenticated);
    
    // Force check authentication again to be sure
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('[TopbarComponent] Double-checking auth state:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('[TopbarComponent] User is authenticated, navigating to cart');
      
      // Check token directly for debugging
      const token = localStorage.getItem('token');
      console.log('[TopbarComponent] Token exists before navigation:', !!token);
      
      // Use direct window.location navigation to avoid any routing issues
      window.location.href = '/cart';
      console.log('[TopbarComponent] Redirected to cart using window.location');
    } else {
      console.log('[TopbarComponent] User is not authenticated, navigating to login');
      // Store the intended destination
      localStorage.setItem('redirectUrl', '/cart');
      this.router.navigate(['/login']).then(success => {
        console.log('[TopbarComponent] Navigation to login result:', success);
      });
    }
  }
}
