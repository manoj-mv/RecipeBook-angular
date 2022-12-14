import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AutoLogin } from './auth/store/auth.action';
import * as fromApp from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RecipeBook';

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.authService.autoLogin();
    this.store.dispatch(new AutoLogin());
  }
}
