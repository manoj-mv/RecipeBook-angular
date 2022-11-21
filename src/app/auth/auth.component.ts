import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiResponse, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading: boolean = false;
  error: string = null;
  logginForm: FormGroup;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.logginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(5)])
    });

    this.authService.autoLogin();
  }

  onAuthModeSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.logginForm.valid) {
      return;
    }

    let authApiCall$: Observable<AuthApiResponse>;
    this.isLoading = true;
    if (this.isLoginMode) {
      authApiCall$ = this.authService.login(this.logginForm.value);
    } else {
      authApiCall$ = this.authService.signup(this.logginForm.value);
    }

    authApiCall$.subscribe(
      {
        next: authResponse => {
          console.log(authResponse);
          this.isLoading = false;
          this.router.navigate(['/recipes'])
        },
        error: errorMsg => {
          this.error = errorMsg;
          this.isLoading = false;
        }
      }
    );
    this.logginForm.reset();
  }

  ngOnDestroy(): void {
  }
}
