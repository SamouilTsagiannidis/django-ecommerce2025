import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
    console.log('[AuthGuard] Constructor called');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('[AuthGuard] canActivate called for route:', state.url);
    console.log('[AuthGuard] Route data:', route.data);
    
    // Check token directly from localStorage for debugging
    const token = localStorage.getItem('token');
    console.log('[AuthGuard] Token from localStorage:', token ? 'exists' : 'not found');
    
    // Check user data from localStorage
    const userData = localStorage.getItem('user');
    console.log('[AuthGuard] User data from localStorage:', userData ? 'exists' : 'not found');
    
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('[AuthGuard] Authentication check result:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('[AuthGuard] User is authenticated, allowing access to:', state.url);
      return true;
    }
    
    console.log('[AuthGuard] User is not authenticated, redirecting to login');
    // Store the attempted URL for redirecting after login
    localStorage.setItem('redirectUrl', state.url);
    
    // Use navigate instead of createUrlTree for more reliable redirection
    this.router.navigate(['/login']);
    return false;
  }
} 