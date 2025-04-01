import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    console.log('[AuthInterceptor Class] Intercepting:', request.url);
    console.log('[AuthInterceptor Class] Token found:', token);

    let authReq = request;

    if (token) {
      console.log('[AuthInterceptor Class] Adding Auth header');
      authReq = request.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
      console.log('[AuthInterceptor Class] Cloned request headers:', authReq.headers.get('Authorization'));
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthInterceptor Class] Error:', error);
        if (error.status === 401) {
          console.log('[AuthInterceptor Class] Received 401, logging out.');
          this.authService.logout().subscribe(() => {
            // Redirecting here can sometimes cause issues, handle carefully
            // this.router.navigate(['/login']);
          });
        }
        return throwError(() => error);
      })
    );
  }
} 