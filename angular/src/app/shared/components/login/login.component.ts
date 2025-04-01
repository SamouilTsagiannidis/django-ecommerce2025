import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
// Import HttpClient
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms'; // Needed for some PrimeNG components if using ngModel temporarily
// import { MessagesModule } from 'primeng/messages'; // Removing MessagesModule as we remove messages
// Removed Message imports

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Import environment

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    // PrimeNG
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    FormsModule,
    // MessagesModule // Removing MessagesModule from imports
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  fieldErrors: { [key: string]: string[] } = {}; // Store field-specific errors
  nonFieldErrors: string[] = []; // Store errors not tied to a specific field
  loading: boolean = false;
  // messages property removed

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient // Inject HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  onSubmit(): void {
    console.log('[LoginComponent] onSubmit triggered.');
    // this.messages = []; // Line removed
    this.fieldErrors = {};
    this.nonFieldErrors = [];
    console.log('[LoginComponent] Form validity:', this.loginForm.valid);
    console.log('[LoginComponent] Form value:', this.loginForm.value);

    if (this.loginForm.valid) {
      this.loading = true;
      console.log('[LoginComponent] Form valid, setting loading=true.');
      const { username, password } = this.loginForm.value;
      console.log('[LoginComponent] Calling authService.login for user:', username);

      this.authService.login(username, password).pipe(
        tap(response => {
          console.log('[LoginComponent] authService.login successful:', response);
          this.loading = false;
          
          // Navigate to home instead of cart to avoid issues
          console.log('[LoginComponent] Attempting to navigate to home page...');
          this.router.navigate(['/'])
            .then(success => {
              console.log('[LoginComponent] Navigation to home result:', success);
              
              if (success) {
                // Fetch cart after successful navigation with delay to avoid timing issues
                setTimeout(() => {
                  console.log('[LoginComponent] Fetching cart after successful login and navigation...');
                  this.cartService.getCart().subscribe({
                    next: cart => console.log('[LoginComponent] Cart fetched after login:', cart),
                    error: err => console.error('[LoginComponent] Error fetching cart after login:', err)
                  });
                }, 0);
              } else {
                console.error('[LoginComponent] Navigation to home failed!');
                this.nonFieldErrors.push('Could not navigate after login.');
              }
            });
        }),
        catchError(error => {
          console.error('[LoginComponent] authService.login error:', error);
          this.loading = false;
          const detail = error?.error?.non_field_errors?.[0] || 'Login failed. Please check your credentials.';
          this.nonFieldErrors.push(detail);
          return of(null);
        })
      ).subscribe(() => {
        console.log('[LoginComponent] authService.login completed.');
      });

    } else {
      console.warn('[LoginComponent] Form invalid, handling frontend errors.');
      // Handle frontend validation errors
      this.nonFieldErrors.push('Please check the highlighted fields.'); // Add to non-field errors
      Object.keys(this.loginForm.controls).forEach(field => {
        const control = this.loginForm.get(field);
        if (control && control.invalid) { // Check validity even if not touched/dirty
          if (!this.fieldErrors[field]) this.fieldErrors[field] = [];
          if (control.errors?.['required']) this.fieldErrors[field].push('This field is required.');
        }
      });
      console.log('[LoginComponent] Frontend validation errors:', this.fieldErrors);
      // this.messages = [{ severity: 'warn', summary: 'Validation Error', detail: 'Please check the highlighted fields.' }]; // Line removed
    }
  }
}
