import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { AppState } from "src/app/store/app.reducer";

import * as RecipeActions from './recipes.action';
import { selectRecipes } from "./recipes.selector";



@Injectable()
export class RecipesEffects {

    loadRecipes$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(RecipeActions.FETCH_RECIPES),
                switchMap(() => {
                    return this.dataStoragrService.fetchRecipes().pipe(
                        map(resp => {
                            console.log(resp);
                            return RecipeActions.fetchRecipesSuccess({ recipes: resp })
                        }),
                        catchError(err => {
                            return of(RecipeActions.fetchRecipesFail());
                        })
                    )
                })
            );
        }
    );

    storeEffect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipeActions.storeRecipes),
            withLatestFrom(this.store.select(selectRecipes)),
            switchMap(([action, recipes]) => {
                console.log(action, recipes);
                return this.dataStoragrService.storeRecipes(recipes);
            })
        )
    }, { dispatch: false });

    constructor(private actions$: Actions,
        private dataStoragrService: DataStorageService,
        private store: Store<AppState>) { }
}
