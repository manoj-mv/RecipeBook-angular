import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Recipe } from '../recipes/recipes.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private url = 'https://ng-course-recipe-book-120d1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json';

  constructor(private http: HttpClient) { }

  storeRecipes(recipes: Recipe[]) {
    return this.http.put(this.url, recipes);
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url).pipe(
      map(recipes => {
        recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.hasOwnProperty('ingredients') ? 'recipe.ingredients' : [] };
        })
        return recipes;
      })
    );
  }
}
