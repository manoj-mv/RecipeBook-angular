import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { AppState } from "../store/app.reducer";
import { Recipe } from "./recipes.model";
import { fetchRecipes, fetchRecipesSuccess } from "./store/recipes.action";
import { selectRecipes } from "./store/recipes.selector";

@Injectable({
    providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService,
        private store: Store<AppState>,
        private actions$: Actions,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        let recipeList = null;
        this.store.select(selectRecipes).pipe(take(1),
        ).subscribe(recipes => {
            recipeList = recipes
        });
        if (!recipeList) {
            this.store.dispatch(fetchRecipes());
            return this.actions$.pipe(
                ofType(fetchRecipesSuccess.type),
                take(1)
            )
        } else {
            return recipeList;
        }
    }
}