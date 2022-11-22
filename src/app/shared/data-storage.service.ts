import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipes.model';
import { RecipeService } from '../recipes/recipes.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private url = 'https://ng-course-recipe-book-120d1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.url, recipes)
      .subscribe(resp => {
        console.log(resp);
      });
  }

  fetchRecipes() {

    return this.http.get<Recipe[]>(this.url).pipe(
      map(recipes => {
        recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.hasOwnProperty('ingredients') ? 'recipe.ingredients' : [] };
        })
        return recipes;
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
