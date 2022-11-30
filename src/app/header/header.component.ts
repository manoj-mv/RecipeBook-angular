import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { DataStorageService } from "../shared/data-storage.service";
import *as fromApp from "../store/app.reducer";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    user: User = null;
    subscription: Subscription;
    isAuthenticated = false;

    constructor(private storageService: DataStorageService,
        private authService: AuthService,
        private store: Store<fromApp.AppState>) { }

    ngOnInit(): void {
        this.subscription = this.store.select('auth').subscribe(
            authState => {
                this.user = authState.user;
                this.isAuthenticated = authState.user ? true : false;
            }
        );
    }
    collapsed = true;

    onSaveData() {
        this.storageService.storeRecipes();
    }

    onFetchData() {
        this.storageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}