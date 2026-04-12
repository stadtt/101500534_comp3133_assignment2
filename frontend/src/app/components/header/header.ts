import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn = false;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {
    this.syncAuthState();
  }

  @HostListener('window:storage')
  onStorageChange(): void {
    this.syncAuthState();
  }

  private syncAuthState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = false;
      return;
    }

    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.syncAuthState();
    this.router.navigate(['/login']);
  }
}
