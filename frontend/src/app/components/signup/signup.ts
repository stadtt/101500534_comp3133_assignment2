import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Header } from '../header/header';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  imports: [Header, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  userService = inject(UserService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  errorMessage = '';

  protected loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  onSubmit() {
    this.errorMessage = '';
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.warn('Login form is invalid:', this.loginForm.getRawValue());
      return;
    }

    if (this.loginForm.valid) {
      const { username, password, email } = this.loginForm.getRawValue();
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();

      this.userService.SignupUser(normalizedEmail, normalizedUsername, password).subscribe({
        next: (result) => {
          if (result) {
            this.router.navigate(['/login']);
            return;
          }

          this.errorMessage = 'Signup failed. Please try again.';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error occurred while signing up:', err);
          this.errorMessage = this.getSignupErrorMessage(err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  private getSignupErrorMessage(error: any): string {
    if (error?.networkError) {
      return 'Unable to reach server. Please try again.';
    }

    if (error?.graphQLErrors?.length) {
      return error.graphQLErrors[0].message || 'Signup failed. Please try again.';
    }

    return 'Signup failed. Please try again.';
  }

}
