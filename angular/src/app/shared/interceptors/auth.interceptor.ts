import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log('[AuthInterceptor] Constructor called');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding token for auth endpoints to avoid token conflicts
    if (request.url.includes('/auth/login/') || request.url.includes('/auth/register/')) {
      console.log('[AuthInterceptor] Skipping auth header for auth endpoint:', request.url);
      return next.handle(request);
    }

    const token = this.authService.getToken();
    console.log('[AuthInterceptor] Intercepting:', request.url, 'Token exists:', !!token);
    
    let authReq = request;
    if (token) {
      console.log('[AuthInterceptor] Adding Auth header for:', request.url);
      authReq = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
    } else {
      console.log('[AuthInterceptor] No token available for:', request.url);
      
      // If trying to access a protected resource without a token, redirect to login
      if (request.url.includes('/api/cart/')) {
        console.log('[AuthInterceptor] Attempting to access protected resource without token, redirecting to login');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Authentication required'));
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthInterceptor] Error for URL:', request.url, 'Status:', error.status);
        
        // Only handle 401 errors for non-auth endpoints
        if (error.status === 401 && 
            !request.url.includes('/auth/login/') && 
            !request.url.includes('/auth/register/')) {
          
          console.log('[AuthInterceptor] Handling 401 error, clearing auth state');
          // Clear auth state
          this.authService.handleLogout();
          
          // Navigate to login page
          console.log('[AuthInterceptor] Redirecting to login page');
          localStorage.setItem('redirectUrl', this.router.url);
          this.router.navigate(['/login']);
        }
        
        return throwError(() => error);
      }),
      finalize(() => {
        console.log('[AuthInterceptor] Request completed for:', request.url);
      })
    );
  }
} 