import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, State } from 'src/app/shopping-list/store/shopping-list.reducer';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeData: Recipe = null;
  id: number;
  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      (params: Params) => {
        this.id = params.get('id');
        this.recipeData = this.recipeService.getRecipeDataUsingIndex(this.id);
      }
    );
  }
  onToShoppingListButtonClicked() {
    if (this.recipeData.ingredients.length > 0) {
      this.recipeService.addIngredientsToShoppingList(this.recipeData.ingredients);
    } else {
      console.log('Nothing to add');
    }
  }

  deleteRecipe(index: number) {
    this.recipeService.deleteRecipe(index);
    this.router.navigate(['recipes']);
  }
}
