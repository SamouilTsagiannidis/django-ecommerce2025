import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  email: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate the token here
      this.currentUserSubject.next(JSON.parse(localStorage.getItem('user') || 'null'));
    }
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register/`, data)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login/`, { username, password })
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout/`, {})
      .pipe(
        tap(() => this.handleLogout())
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    console.log('[AuthService] handleAuthentication called with response:', response);
    
    // Store token in localStorage
    localStorage.setItem('token', response.token);
    console.log('[AuthService] Token stored in localStorage:', response.token);
    
    // You might want to fetch the full user details here
    const user: User = {
      id: response.user_id,
      email: response.email,
      username: '', // You'll need to fetch this from a separate endpoint
      first_name: '',
      last_name: ''
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update the current user subject
    this.currentUserSubject.next(user);
    console.log('[AuthService] Updated currentUserSubject with user:', user);
  }

  private handleLogout(): void {
    console.log('[AuthService] handleLogout called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    console.log('[AuthService] Token removed from localStorage');
  }

  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem('token');
    console.log('[AuthService] isAuthenticated check:', hasToken);
    return hasToken;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('[AuthService] getToken called, returning:', token);
    return token;
  }
} 