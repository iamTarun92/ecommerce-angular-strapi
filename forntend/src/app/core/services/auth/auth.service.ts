// auth.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:1337/api';

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public currentuser: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(localStorage.getItem('authenticated') ? true : false);
    this.currentuser = new BehaviorSubject<string>(localStorage.getItem('user') || '');
  }


  login(credentials: { identifier: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/local`, credentials).pipe(
      tap(response => {
        if (response.jwt) {
          localStorage.setItem('session_token', response.jwt);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('authenticated', 'true');
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable()
  }

  getToken(): string | null {
    return localStorage.getItem('session_token');
  }
  getUser(): string | null {
    return localStorage.getItem('user');
  }
}
