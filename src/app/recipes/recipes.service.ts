import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { AddIngredients } from "../shopping-list/store/shopping-list.actions";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import { Recipe } from "./recipes.model";

@Injectable({
    providedIn: "root"
})
export class RecipeService {
    recipesChanged: Subject<Recipe[]> = new Subject();
    private recipes: Recipe[] = [];

    constructor(private store: Store<fromShoppingList.State>) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
    getRecipes() {
        if (this.recipes.length > 0) {
            return this.recipes.slice();
        }
        else {
            return null;
        }
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addMultipleIngredients(ingredients);
        this.store.dispatch(new AddIngredients(ingredients));

    }

    getRecipeDataUsingIndex(index: number) {
        return this.recipes.slice()[index];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, updatedRecipe: Recipe) {
        this.recipes[index] = updatedRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

}