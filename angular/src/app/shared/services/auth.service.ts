import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
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
    console.log('[AuthService] Constructor called');
    this.initializeFromLocalStorage();
  }

  private initializeFromLocalStorage(): void {
    const token = localStorage.getItem('token');
    console.log('[AuthService] Initializing from localStorage, token exists:', !!token);
    
    if (token) {
      try {
        const userJson = localStorage.getItem('user');
        console.log('[AuthService] User JSON from localStorage:', userJson);
        
        const user = userJson ? JSON.parse(userJson) : null;
        console.log('[AuthService] User from localStorage:', user);
        
        if (user) {
          this.currentUserSubject.next(user);
          console.log('[AuthService] User state initialized from localStorage');
        } else {
          console.log('[AuthService] Token exists but no user data found');
          // Create a minimal user object to ensure authentication works
          const minimalUser = {
            id: 0,
            username: 'user',
            email: '',
            first_name: '',
            last_name: ''
          };
          this.currentUserSubject.next(minimalUser);
          console.log('[AuthService] Created minimal user object for authentication');
        }
      } catch (error) {
        console.error('[AuthService] Error parsing user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('user');
      }
    } else {
      console.log('[AuthService] No token found in localStorage');
      this.currentUserSubject.next(null);
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
    const token = this.getToken();
    if (!token) {
      console.log('[AuthService] No token found, skipping logout API call');
      return of(void 0);
    }
    
    return this.http.post<void>(`${environment.apiUrl}/auth/logout/`, {})
      .pipe(
        tap(() => {
          console.log('[AuthService] Logout API call successful');
        })
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

  public handleLogout(): void {
    console.log('[AuthService] handleLogout called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    console.log('[AuthService] Token and user data removed from localStorage');
  }

  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem('token');
    console.log('[AuthService] isAuthenticated check:', hasToken);
    return hasToken;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token;
  }
} 