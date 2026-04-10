import { Component } from '@angular/core';
import { Header } from '../header/header';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { inject } from '@angular/core';


@Component({
  selector: 'Login',
  imports: [Header, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userService = inject(UserService);

  protected loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {

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
            return;
          }
          console.log('Logged in user:', user);
          
        },
        error: (error) => {
          console.error('Login error:', error);
        }
      });
    }
  }


}
