import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { matchPasswordValidator } from 'src/app/validation.directive';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  code = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(data => {
      this.code = this.activeRoute.snapshot.params['token']
    })

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', Validators.required]
    }, { validators: matchPasswordValidator('password', 'passwordConfirmation') })
  }

  resetPassword() {
    this.authService.resetPassword(this.code, this.resetForm.value.password, this.resetForm.value.passwordConfirmation).subscribe({
      next: respose => {
        alert("Your user's password has been reset.")
        this.router.navigate(['login'])
      },
      error: error => alert('An error occurred:' + error.error.error.message)
    })
  }

}
