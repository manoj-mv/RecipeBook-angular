import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipes.model";
import { RecipeService } from "./recipes.service";

@Injectable({
    providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipeService.getRecipes();
        if (!recipes) {
            return this.dataStorageService.fetchRecipes();
        }
    }
}