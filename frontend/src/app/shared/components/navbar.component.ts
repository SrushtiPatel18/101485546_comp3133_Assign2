import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <span class="brand" routerLink="/">Employee Manager</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.authStatus$ | async; else unauth">
        <button mat-button routerLink="/employees">Employees</button>
        <button mat-flat-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </ng-container>
      <ng-template #unauth>
        <button mat-button routerLink="/login">Login</button>
        <button mat-raised-button color="accent" routerLink="/signup">Sign Up</button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
    }
    .brand {
      cursor: pointer;
      font-weight: 500;
    }
    .spacer {
      flex: 1 1 auto;
    }
    button {
      margin-left: 10px;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
