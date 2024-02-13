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
  public isAuthenticated: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(localStorage.getItem('authenticated') ? true : false); this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
  }


  login(credentials: { identifier: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/local`, credentials).pipe(
      tap(response => {
        if (response.jwt) {
          localStorage.setItem('session_token', response.jwt);
          localStorage.setItem('authenticated', 'true');
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('session_token');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated
  }

  getToken(): string | null {
    return localStorage.getItem('session_token');
  }
}
