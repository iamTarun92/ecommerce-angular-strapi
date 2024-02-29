import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:1337/api';

  private isLoggedInSubject: BehaviorSubject<boolean>;
  private currentuser: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('authenticated') ? true : false);
    this.currentuser = new BehaviorSubject<string>(localStorage.getItem('user') || '');
  }


  login(credentials: { identifier: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/local`, credentials).pipe(
      tap(response => {
        if (response.jwt) {
          localStorage.setItem('session_token', response.jwt);
          localStorage.setItem('authenticated', 'true');
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('session_token');
    localStorage.removeItem('authenticated');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable()
    // return !!localStorage.getItem('session_token');
  }

  getToken(): string | null {
    return localStorage.getItem('session_token');
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('user');
  }

  // getCurrentUser(): any {
  //   // return user details from token
  //   const token = localStorage.getItem('session_token');
  //   // decode token to get user details
  //   return token ? JSON.parse(atob(token.split('.')[1])) : null;
  // }
}
