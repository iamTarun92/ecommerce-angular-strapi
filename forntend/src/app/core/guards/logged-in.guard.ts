import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!localStorage.getItem('authenticated') && !localStorage.getItem('session_token')) {
      return true; // User is authenticated, allow access
    } else {
      this.router.navigate(['category']); // User is not authenticated, redirect to login page
      return false;
    }
  }
}
