import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipes.model';
import * as recipeSelector from '../store/recipes.selector';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipes$: Observable<Recipe[]>;
  recipesChangedSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.recipes$ = this.store.select(recipeSelector.selectRecipes);
  }

  onNewRecipeAdded() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy(): void {
    if (this.recipesChangedSubscription) {
      this.recipesChangedSubscription.unsubscribe();
    }
  }
}
