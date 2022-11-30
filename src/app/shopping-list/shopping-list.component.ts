import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import * as shoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';




@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  private ingredientsSub: Subscription;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.ingredients$ = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();

    // this.ingredientsSub = this.shoppingListService.ingredientChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
  }

  onEditItem(id: number) {
    this.store.dispatch(new shoppingListActions.StartEditIngredient({ index: id }));
  }

  ngOnDestroy(): void {
    if (this.ingredientsSub) {
      this.ingredientsSub.unsubscribe;
    }
  }
}
