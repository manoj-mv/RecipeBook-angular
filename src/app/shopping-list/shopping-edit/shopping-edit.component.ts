import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as shoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode: boolean = false;
  editedItem: Ingredient;
  @ViewChild('f') slForm: NgForm;

  constructor(
    private store: Store<fromShoppingList.AppState>) { }

  ngOnInit(): void {
    // this.subscription = this.slService.startedEditing.subscribe((id: number) => {
    //   this.editedItemIndex = id;
    //   this.editMode = true;
    //   this.editedItem = this.slService.getIngredient(this.editedItemIndex);
    //   this.slForm.setValue({
    //     'name': this.editedItem.name,
    //     'amount': this.editedItem.amount
    //   })
    // });
    this.subscription = this.store.select('shoppingList').subscribe(shoppingListData => {
      console.log(shoppingListData);
      if (shoppingListData.editedIngredientIndex >= 0) {
        this.editedItem = shoppingListData.editedIngredient;
        this.editMode = shoppingListData.editMode;
        this.slForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        });
      } else {
        this.editMode = shoppingListData.editMode;
      }
    })
  }

  onSubmit(f: NgForm) {
    const ingName = f.value.name;
    const ingAmount = f.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.updateIngredient(newIngredient);
    } else {
      this.addIngredient(newIngredient);
    }
    this.onReset();
  }
  addIngredient(newIngredient: Ingredient) {
    this.store.dispatch(new shoppingListActions.AddIngredient(newIngredient));
  }

  updateIngredient(ingredient: Ingredient) {
    this.store.dispatch(new shoppingListActions.UpdateIngredient({ newIngredient: ingredient }));
  }

  onReset() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new shoppingListActions.StopEditIngredient());
  }

  onDelete() {
    this.store.dispatch(new shoppingListActions.DeleteIngredient());
    this.onReset();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.store.dispatch(new shoppingListActions.StopEditIngredient());
  }
}
