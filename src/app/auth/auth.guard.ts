import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // console.log(route, state);

        return this.authService.userSubject.pipe(take(1), map(user => {
            console.log(user);
            if (user && user.token) {
                return true;   // user is authenticated
            } else {
                console.log('reached');
                return this.router.createUrlTree(['/auth']);
            }
        }));

    }
}