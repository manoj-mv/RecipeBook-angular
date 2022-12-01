import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/directives/placeholder.directive';
import *as fromApp from '../store/app.reducer';
import * as authActions from 'src/app/auth/store/auth.action';


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
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.logginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(5)])
    });


    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    })

  }

  onAuthModeSwitch() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.logginForm.valid) {
      return;
    }

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new authActions.LoginStart(this.logginForm.value));
    } else {
      this.store.dispatch(new authActions.SignupStart(this.logginForm.value));
    }
    this.logginForm.reset();
  }


  showErrorAlert(errorMessage: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent<AlertComponent>(AlertComponent);
    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      hostViewContainerRef.clear();
      // this.error = null;
      this.resetError();
      this.closeSub.unsubscribe();
    })
  }

  resetError() {
    this.store.dispatch(new authActions.ClearError());
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
