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
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
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
      this.userService.SignupUser(email, username, password).subscribe({
        next: (result) => {
          if (result) {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Error occurred while signing up:', err);
          this.errorMessage = 'An error occurred while signing up. Please try again.';
        }
      });
    }
  }

}
