import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    user: User = null;
    subscription: Subscription;
    isAuthenticated = false;

    constructor(private storageService: DataStorageService, private authService: AuthService) { }

    ngOnInit(): void {
        this.subscription = this.authService.userSubject.subscribe(
            user => {
                this.user = user;
                console.log(user);
                this.isAuthenticated = user ? true : false;
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