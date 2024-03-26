import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  email = '';
  hasPassword = false

  constructor(
    private authService: AuthService
  ) { }
  ngOnInit(): void {

  }
  forgotPassword() {
    this.authService.forgotPassword(this.email).subscribe(
      {
        next: (response) => {
          this.hasPassword = true
          alert('Password reset email sent successfully');
        },
        error: (error) => {
          alert('Error resetting password:' + error.error.error.message);
        }
      }
    );
  }
}
