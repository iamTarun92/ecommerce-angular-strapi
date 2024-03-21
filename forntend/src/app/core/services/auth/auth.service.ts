import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:1337/api';

  private isLoggedInSubject: BehaviorSubject<boolean>;
  private currentuser: BehaviorSubject<string>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('authenticated') ? true : false);
    this.currentuser = new BehaviorSubject<string>(localStorage.getItem('user') || '');
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/local`, { identifier, password }).pipe(
      tap(response => {
        if (response.jwt) {
          this.setLocalStorage(response)
        }
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/local/register`
    return this.http.post<any>(url, { username, email, password }).pipe(
      tap(response => {
        if (response.jwt) {
          this.setLocalStorage(response)
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

  setLocalStorage(response: any) {
    localStorage.setItem('session_token', response.jwt);
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('user', JSON.stringify(response.user));
    this.isLoggedInSubject.next(true);
    this.router.navigate(['category'])
  }

  // getCurrentUser(): any {
  //   // return user details from token
  //   const token = localStorage.getItem('session_token');
  //   // decode token to get user details
  //   return token ? JSON.parse(atob(token.split('.')[1])) : null;
  // }

  sendConfirmationEmail(currentUser: any, message: string) {
    emailjs.init("_u6qKPa9-76niq83g")
    return emailjs.send("service_tjvnsxq", "template_7uud2sl", {
      from_name: "Promantus",
      to_name: currentUser.username,
      to: currentUser.email,
      message: message,
    })
  }
}
