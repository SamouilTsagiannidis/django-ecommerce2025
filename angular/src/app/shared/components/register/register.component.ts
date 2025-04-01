import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms'; // Needed for some PrimeNG components if using ngModel temporarily

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
    FormsModule // Add FormsModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  fieldErrors: { [key: string]: string[] } = {};
  nonFieldErrors: string[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password2')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    this.fieldErrors = {};
    this.nonFieldErrors = [];

    if (this.registerForm.valid) {
      this.loading = true;

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login'], { queryParams: { registered: 'success' } });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Registration failed:', err);
          if (err.status === 400 && err.error) {
            const errors = err.error;
            console.log('Raw backend errors:', errors);

            this.fieldErrors = {};
            this.nonFieldErrors = [];

            for (const field in errors) {
              if (errors.hasOwnProperty(field)) {
                this.fieldErrors[field] = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
              }
            }

            console.log('Processed field errors:', this.fieldErrors);

            if (this.fieldErrors['non_field_errors']) {
              this.nonFieldErrors = this.fieldErrors['non_field_errors'];
              delete this.fieldErrors['non_field_errors'];
              console.log('Processed non-field errors:', this.nonFieldErrors);
            }

            if (this.registerForm.errors?.['mismatch']) {
              this.fieldErrors['password2'] = [...(this.fieldErrors['password2'] || []), "Passwords do not match."];
              console.log('Added password mismatch error');
            }
          } else {
            this.nonFieldErrors.push(err.message || 'An unexpected error occurred during registration. Please try again.');
            console.log('Non-400 error:', this.nonFieldErrors);
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        if (control && control.invalid && (control.dirty || control.touched)) {
          if (!this.fieldErrors[field]) this.fieldErrors[field] = [];
          if (control.errors?.['required']) this.fieldErrors[field].push('This field is required.');
          if (control.errors?.['email']) this.fieldErrors[field].push('Please enter a valid email address.');
          if (control.errors?.['minlength']) this.fieldErrors[field].push(`Minimum length is ${control.errors['minlength'].requiredLength}.`);
        }
      });
      if (this.registerForm.errors?.['mismatch']) {
        this.fieldErrors['password2'] = [...(this.fieldErrors['password2'] || []), "Passwords do not match."];
      }
    }
  }
}
