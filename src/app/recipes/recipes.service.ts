import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipes.model";

@Injectable({
    providedIn: "root"
})
export class RecipeService {
    recipesChanged: Subject<Recipe[]> = new Subject();

    private recipes: Recipe[] = [
        new Recipe('A Test Recipe', 'Test', 'https://assets.bonappetit.com/photos/62e2b81a029c78e6c977d31b/1:1/w_960,c_limit/0728-blueberry-muffin-cake-recipe-lede.jpg', [new Ingredient('Meat', 1), new Ingredient('Potato', 5)]),
        new Recipe('Test Recipe 2', 'Test 2', 'https://www.averiecooks.com/wp-content/uploads/2021/01/garlicbutterchicken-5.jpg', [new Ingredient('Tomato', 7)])
    ];

    constructor(private shoppingListService: ShoppingListService) { }

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addMultipleIngredients(ingredients);
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