import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { LOGIN_USER, SIGNUP_USER } from '../graphql/mutations';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apollo = inject(Apollo);
  private router = inject(Router);
  private authStatusSub = new BehaviorSubject<boolean>(this.hasToken());

  get authStatus$(): Observable<boolean> {
    return this.authStatusSub.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(usernameOrEmail: string, password: string): Observable<string> {
    return this.apollo.mutate({
      mutation: LOGIN_USER,
      variables: { usernameOrEmail, password }
    }).pipe(
      map((res: any) => {
        const { success, message, token } = res.data.login;
        if (!success) throw new Error(message);
        localStorage.setItem('token', token);
        this.authStatusSub.next(true);
        return token;
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: SIGNUP_USER,
      variables: { input: { username, email, password } }
    }).pipe(
      map((res: any) => {
        const { success, message } = res.data.signup;
        if (!success) throw new Error(message);
        return res.data.signup;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStatusSub.next(false);
    this.router.navigate(['/login']);
  }
}
