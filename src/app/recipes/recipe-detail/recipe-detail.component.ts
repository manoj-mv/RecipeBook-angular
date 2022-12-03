import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap, tap } from 'rxjs';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipes.model';
import { deleteRecipe } from '../store/recipes.action';
import { RecipesState } from '../store/recipes.reducer';
import { selectRecipes } from '../store/recipes.selector';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeData: Recipe = null;
  id: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    console.log('test');

    // this.route.paramMap.subscribe(
    //   (params: Params) => {
    //     this.id = params.get('id');

    //     // this.recipeData = this.recipeService.getRecipeDataUsingIndex(this.id);

    //   }
    // );
    this.route.paramMap.pipe(
      map((params: Params) => {
        return params.get('id');
      }),
      switchMap(id => {
        this.id = Number(id);
        return this.store.select(selectRecipes)
      }),
      map((recipes) => {
        return recipes.find((recipe, index) => {
          return this.id === index;
        });
      }),
    ).subscribe(recipe => {
      console.log(recipe);
      this.recipeData = recipe;
    });
  }
  onToShoppingListButtonClicked() {
    if (this.recipeData.ingredients.length > 0) {
      // this.recipeService.addIngredientsToShoppingList(this.recipeData.ingredients);
      this.store.dispatch(new AddIngredients(this.recipeData.ingredients));
    } else {
      console.log('Nothing to add');
    }
  }

  deleteRecipe(index: number) {
    // this.recipeService.deleteRecipe(index);
    this.store.dispatch(deleteRecipe({ index: index }))
    this.router.navigate(['recipes']);
  }
}
