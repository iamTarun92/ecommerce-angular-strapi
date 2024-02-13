import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/core.index';
import { AuthService } from 'src/app/core/helper/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  loginFormSubmit() {
    const credentials = {
      identifier: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loginForm.reset()
        this.router.navigate(['category'])
      },
      error: (error) => alert('Please contact admin.')
    })
  }
}
