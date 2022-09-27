import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeData: Recipe;
  id: number;
  constructor(private recipeService: RecipeService, private route: ActivatedRoute) { }

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
      console.log(this.recipeData.ingredients.length);
      this.recipeService.addIngredientsToShoppingList(this.recipeData.ingredients);
    } else {
      console.log('Nothing to add');
    }
  }
}
