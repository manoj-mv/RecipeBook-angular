import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipeData: Recipe;
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
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
