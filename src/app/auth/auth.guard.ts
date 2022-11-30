import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, take } from "rxjs";
import * as fromApp from "../store/app.reducer";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router,
        private store: Store<fromApp.AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // console.log(route, state);

        return this.store.select('auth').pipe(take(1), map(authState => {
            console.log(authState.user);
            if (authState.user && authState.user.token) {
                return true;   // user is authenticated
            } else {
                console.log('reached');
                return this.router.createUrlTree(['/auth']);
            }
        }));

    }
}