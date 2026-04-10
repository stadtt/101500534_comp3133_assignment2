import { ChangeDetectorRef, Component } from '@angular/core';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'Login',
  imports: [Header, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userService = inject(UserService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  errorMessage = '';

  protected loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.warn('Login form is invalid:', this.loginForm.getRawValue());
      return;
    }

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.getRawValue();
      this.userService.LoginUser(username, password).subscribe({
        next: (user) => {
          if (!user) {
            console.log('Login failed: invalid username or password');
            this.errorMessage = 'Invalid username or password';
            this.cdr.detectChanges();
            return;
          }
          console.log('Logged in user:', user);
          this.router.navigate(['/employee-list']);
          
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = this.getLoginErrorMessage(error);
          this.cdr.detectChanges();
        }
      });
    }
  }

  private getLoginErrorMessage(error: any): string {
    if (error?.networkError) {
      return 'Unable to reach server. Please try again.';
    }

    if (error?.graphQLErrors?.length) {
      return error.graphQLErrors[0].message || 'Login failed. Please try again.';
    }

    return 'Login failed. Please try again.';
  }


}
